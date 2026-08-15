from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str
    API_VERSION: str

    HOST: str
    PORT: int

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    MONGO_URI: str
    MONGO_DB: str

    class Config:
        env_file = ".env"


settings = Settings()