from unittest.mock import MagicMock, patch
from uuid import uuid4

from app.services.storage import StorageService


@patch("app.services.storage.boto3.client")
def test_storage_upload_delete_round_trip(mock_boto_client):
    mock_client = MagicMock()
    mock_boto_client.return_value = mock_client
    mock_client.get_object.return_value = {"Body": MagicMock(read=lambda: b"payload")}

    service = StorageService()
    user_id = uuid4()
    file_id = uuid4()
    path = service.build_storage_path(user_id, file_id, "doc.txt")

    assert path == f"{user_id}/{file_id}/doc.txt"

    service.upload_file(path, b"payload", "text/plain")
    mock_client.put_object.assert_called_once()

    service.delete_file(path)
    mock_client.delete_object.assert_called_once()

    content = service.download_file(path)
    assert content == b"payload"
