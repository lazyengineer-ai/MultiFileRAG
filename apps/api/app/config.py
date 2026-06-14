from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+psycopg://multifilerag:multifilerag@localhost:5432/multifilerag"
    api_auth_secret: str = "dev-secret-change-me"
    cors_origins: str = "http://localhost:3000"

    s3_endpoint_url: str = "http://localhost:9000"
    s3_access_key_id: str = "minioadmin"
    s3_secret_access_key: str = "minioadmin"
    s3_bucket_name: str = "multifilerag"
    s3_region: str = "us-east-1"
    r2_account_id: str = ""

    max_file_size_bytes: int = 15 * 1024 * 1024
    max_account_storage_bytes: int = 100 * 1024 * 1024

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
