import json
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[4]
_EXTENSIONS_PATH = _REPO_ROOT / "packages" / "shared" / "supported_extensions.json"

with _EXTENSIONS_PATH.open(encoding="utf-8") as f:
    _DATA = json.load(f)

SUPPORTED_EXTENSIONS: frozenset[str] = frozenset(
    ext.lower()
    for category in ("documents", "spreadsheets", "source_code")
    for ext in _DATA[category]
)

SUPPORTED_EXTENSIONS_LIST: list[str] = sorted(SUPPORTED_EXTENSIONS)

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024
MAX_ACCOUNT_STORAGE_BYTES = 100 * 1024 * 1024


def get_extension(filename: str) -> str:
    dot = filename.rfind(".")
    if dot == -1:
        return ""
    return filename[dot + 1 :].lower()


def is_supported_extension(filename: str) -> bool:
    ext = get_extension(filename)
    return bool(ext) and ext in SUPPORTED_EXTENSIONS


def unsupported_type_message() -> str:
    return (
        "Unsupported file type. Supported extensions: "
        + ", ".join(f".{ext}" for ext in SUPPORTED_EXTENSIONS_LIST)
    )
