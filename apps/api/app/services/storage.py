from __future__ import annotations

from typing import Optional
from uuid import UUID

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from app.config import settings


class StorageService:
    def __init__(self) -> None:
        self._client = boto3.client(
            "s3",
            endpoint_url=self._endpoint_url(),
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region,
            config=Config(signature_version="s3v4"),
        )
        self._bucket = settings.s3_bucket_name

    def _endpoint_url(self) -> str:
        if settings.r2_account_id:
            return f"https://{settings.r2_account_id}.r2.cloudflarestorage.com"
        return settings.s3_endpoint_url

    def build_storage_path(self, user_id: UUID, file_id: UUID, filename: str) -> str:
        return f"{user_id}/{file_id}/{filename}"

    def upload_file(self, storage_path: str, content: bytes, content_type: Optional[str] = None) -> str:
        extra_args = {}
        if content_type:
            extra_args["ContentType"] = content_type
        self._client.put_object(
            Bucket=self._bucket,
            Key=storage_path,
            Body=content,
            **extra_args,
        )
        return storage_path

    def delete_file(self, storage_path: str) -> None:
        try:
            self._client.delete_object(Bucket=self._bucket, Key=storage_path)
        except ClientError:
            pass

    def download_file(self, storage_path: str) -> bytes:
        response = self._client.get_object(Bucket=self._bucket, Key=storage_path)
        return response["Body"].read()


storage_service = StorageService()
