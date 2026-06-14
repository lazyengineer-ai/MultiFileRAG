from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import AuthSyncRequest, create_access_token
from app.database import get_db
from app.deps import require_internal_secret
from app.models import User

router = APIRouter(prefix="/v1/auth", tags=["auth"])


class AuthSyncResponse(BaseModel):
    user_id: UUID
    access_token: str


@router.post("/sync", response_model=AuthSyncResponse)
def sync_user(
    body: AuthSyncRequest,
    db: Session = Depends(get_db),
    _: None = Depends(require_internal_secret),
) -> AuthSyncResponse:
    stmt = select(User).where(
        User.oauth_provider == body.provider,
        User.oauth_subject == body.oauth_subject,
    )
    user = db.scalar(stmt)

    if user is None:
        user = User(
            oauth_provider=body.provider,
            oauth_subject=body.oauth_subject,
            email=body.email,
        )
        db.add(user)
    elif body.email and user.email != body.email:
        user.email = body.email

    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.oauth_provider, user.oauth_subject, user.email)
    return AuthSyncResponse(user_id=user.id, access_token=token)
