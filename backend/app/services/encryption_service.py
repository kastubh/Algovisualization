from cryptography.fernet import Fernet, InvalidToken

from app.config import settings


def _fernet() -> Fernet:
    return Fernet(settings.fernet_secret_key.encode())


def encrypt_key(plain_key: str) -> str:
    return _fernet().encrypt(plain_key.encode()).decode()


def decrypt_key(encrypted_key: str) -> str:
    try:
        return _fernet().decrypt(encrypted_key.encode()).decode()
    except InvalidToken as exc:
        raise ValueError("Could not decrypt API key") from exc
