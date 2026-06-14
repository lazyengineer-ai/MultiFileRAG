from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi import File as FileUpload
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import settings
from app.constants.extensions import (
    MAX_ACCOUNT_STORAGE_BYTES,
    MAX_FILE_SIZE_BYTES,
    get_extension,
    is_supported_extension,
    unsupported_type_message,
)
from app.database import get_db
from app.deps import get_current_user
from app.models import File as FileModel
from app.models import FileStatus, User
from app.services.storage import storage_service

router = APIRouter(prefix="/v1/files", tags=["files"])


class FileResponse(BaseModel):
    id: UUID
    filename: str
    extension: str
    size_bytes: int
    status: FileStatus
    error_message: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class StorageSummary(BaseModel):
    used_bytes: int
    max_bytes: int
    used_mb: float
    max_mb: float


class FileListResponse(BaseModel):
    files: list[FileResponse]
    storage: StorageSummary


def _storage_summary(used_bytes: int) -> StorageSummary:
    return StorageSummary(
        used_bytes=used_bytes,
        max_bytes=MAX_ACCOUNT_STORAGE_BYTES,
        used_mb=round(used_bytes / (1024 * 1024), 2),
        max_mb=round(MAX_ACCOUNT_STORAGE_BYTES / (1024 * 1024), 2),
    )


def _get_used_bytes(db: Session, user_id: UUID) -> int:
    total = db.scalar(
        select(func.coalesce(func.sum(FileModel.size_bytes), 0)).where(FileModel.user_id == user_id)
    )
    return int(total or 0)


def _validate_upload_with_replace(
    db: Session, user_id: UUID, filename: str, size: int, replace_file_id: UUID
) -> None:
    if not is_supported_extension(filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unsupported_type_message())
    if size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds the 15 MB per-file limit ({size} bytes).",
        )
    if size <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty.")

    existing = db.get(FileModel, replace_file_id)
    if existing is None or existing.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    used = _get_used_bytes(db, user_id) - existing.size_bytes + size
    if used > MAX_ACCOUNT_STORAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Replace would exceed the 100 MB account limit. "
                f"New total would be {used} bytes."
            ),
        )


@router.get("", response_model=FileListResponse)
def list_files(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FileListResponse:
    stmt = select(FileModel).where(FileModel.user_id == current_user.id).order_by(FileModel.created_at.desc())
    files = list(db.scalars(stmt).all())
    used = _get_used_bytes(db, current_user.id)
    return FileListResponse(
        files=[FileResponse.model_validate(f) for f in files],
        storage=_storage_summary(used),
    )


@router.post("", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    upload: UploadFile = FileUpload(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FileResponse:
    filename = upload.filename or "unnamed"
    content = await upload.read()
    size = len(content)
    used = _get_used_bytes(db, current_user.id)

    if not is_supported_extension(filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unsupported_type_message())
    if size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds the 15 MB per-file limit ({size} bytes).",
        )
    if size <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty.")
    if used + size > MAX_ACCOUNT_STORAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Upload would exceed the 100 MB account limit. "
                f"Currently using {used} bytes; this file is {size} bytes."
            ),
        )

    extension = get_extension(filename)
    file_record = FileModel(
        user_id=current_user.id,
        filename=filename,
        extension=extension,
        size_bytes=size,
        status=FileStatus.UPLOADING,
        storage_path="",
    )
    db.add(file_record)
    db.flush()

    storage_path = storage_service.build_storage_path(current_user.id, file_record.id, filename)
    try:
        storage_service.upload_file(storage_path, content, upload.content_type)
        file_record.storage_path = storage_path
        file_record.status = FileStatus.PROCESSING
        db.commit()
        db.refresh(file_record)
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store file: {exc}",
        ) from exc

    return FileResponse.model_validate(file_record)


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    file_record = db.get(FileModel, file_id)
    if file_record is None or file_record.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    storage_service.delete_file(file_record.storage_path)
    db.delete(file_record)
    db.commit()


@router.put("/{file_id}", response_model=FileResponse)
async def replace_file(
    file_id: UUID,
    upload: UploadFile = FileUpload(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FileResponse:
    file_record = db.get(FileModel, file_id)
    if file_record is None or file_record.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    filename = upload.filename or file_record.filename
    content = await upload.read()
    size = len(content)

    _validate_upload_with_replace(db, current_user.id, filename, size, file_id)

    old_path = file_record.storage_path
    extension = get_extension(filename)
    new_path = storage_service.build_storage_path(current_user.id, file_record.id, filename)

    try:
        storage_service.upload_file(new_path, content, upload.content_type)
        storage_service.delete_file(old_path)
        file_record.filename = filename
        file_record.extension = extension
        file_record.size_bytes = size
        file_record.storage_path = new_path
        file_record.status = FileStatus.PROCESSING
        file_record.error_message = None
        db.commit()
        db.refresh(file_record)
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to replace file: {exc}",
        ) from exc

    return FileResponse.model_validate(file_record)
