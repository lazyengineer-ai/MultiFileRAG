from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Optional
from uuid import UUID

from jose import JWTError, jwt
from pydantic import BaseModel

from app.config import settings

ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7


class TokenPayload(BaseModel):
    sub: str
    provider: str
    oauth_subject: str
    email: Optional[str] = None


class AuthSyncRequest(BaseModel):
    provider: str
    oauth_subject: str
    email: Optional[str] = None


def create_access_token(
    user_id: UUID, provider: str, oauth_subject: str, email: Optional[str]
) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": str(user_id),
        "provider": provider,
        "oauth_subject": oauth_subject,
        "email": email,
        "exp": expire,
    }
    return jwt.encode(payload, settings.api_auth_secret, algorithm=ALGORITHM)


def decode_access_token(token: str) -> TokenPayload:
    try:
        data: dict[str, Any] = jwt.decode(token, settings.api_auth_secret, algorithms=[ALGORITHM])
        return TokenPayload(
            sub=data["sub"],
            provider=data["provider"],
            oauth_subject=data["oauth_subject"],
            email=data.get("email"),
        )
    except JWTError as exc:
        raise ValueError("Invalid token") from exc


def verify_internal_secret(provided: Optional[str]) -> bool:
    return bool(provided) and provided == settings.api_auth_secret
