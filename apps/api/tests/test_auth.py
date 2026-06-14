from app.config import settings
from app.models import User


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_protected_route_requires_auth(client):
    response = client.get("/v1/files")
    assert response.status_code == 401


def test_auth_sync_creates_user(client, db_session):
    response = client.post(
        "/v1/auth/sync",
        json={
            "provider": "google",
            "oauth_subject": "subject-123",
            "email": "user@example.com",
        },
        headers={"X-API-Key": settings.api_auth_secret},
    )
    assert response.status_code == 200
    data = response.json()
    assert "user_id" in data
    assert "access_token" in data

    user = db_session.query(User).one()
    assert user.oauth_provider == "google"
    assert user.oauth_subject == "subject-123"


def test_auth_sync_rejects_invalid_key(client):
    response = client.post(
        "/v1/auth/sync",
        json={"provider": "google", "oauth_subject": "x", "email": None},
        headers={"X-API-Key": "wrong"},
    )
    assert response.status_code == 401
