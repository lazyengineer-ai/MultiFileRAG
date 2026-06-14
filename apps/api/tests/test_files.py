from unittest.mock import MagicMock, patch
from uuid import uuid4

from app.auth import create_access_token
from app.config import settings
from app.models import User


def _create_user(db_session, provider="google", subject="sub-1"):
    user = User(oauth_provider=provider, oauth_subject=subject, email="a@b.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _auth_header(user):
    token = create_access_token(user.id, user.oauth_provider, user.oauth_subject, user.email)
    return {"Authorization": f"Bearer {token}"}


@patch("app.routers.files.storage_service")
def test_upload_list_delete(mock_storage, client, db_session):
    mock_storage.build_storage_path.return_value = "path/test.txt"
    mock_storage.upload_file.return_value = "path/test.txt"
    mock_storage.delete_file.return_value = None

    user = _create_user(db_session)
    headers = _auth_header(user)

    files = {"upload": ("notes.txt", b"hello world", "text/plain")}
    response = client.post("/v1/files", files=files, headers=headers)
    assert response.status_code == 201
    payload = response.json()
    assert payload["filename"] == "notes.txt"
    assert payload["status"] == "processing"

    list_response = client.get("/v1/files", headers=headers)
    assert list_response.status_code == 200
    data = list_response.json()
    assert len(data["files"]) == 1
    assert data["storage"]["used_bytes"] > 0

    delete_response = client.delete(f"/v1/files/{payload['id']}", headers=headers)
    assert delete_response.status_code == 204
    mock_storage.delete_file.assert_called_once()


def test_reject_unsupported_extension(client, db_session):
    user = _create_user(db_session)
    headers = _auth_header(user)
    files = {"upload": ("slides.pptx", b"data", "application/vnd.ms-powerpoint")}
    response = client.post("/v1/files", files=files, headers=headers)
    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]


def test_reject_oversized_file(client, db_session):
    user = _create_user(db_session)
    headers = _auth_header(user)
    big_content = b"x" * (15 * 1024 * 1024 + 1)
    files = {"upload": ("big.txt", big_content, "text/plain")}
    response = client.post("/v1/files", files=files, headers=headers)
    assert response.status_code == 400
    assert "15 MB" in response.json()["detail"]
