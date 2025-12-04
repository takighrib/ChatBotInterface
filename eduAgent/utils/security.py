import bcrypt
from datetime import datetime, timedelta
from jose import jwt, JWTError

# =====================================================
# CONFIGURATION
# =====================================================

SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_ME"  # mets une vraie clé dans .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24h


# =====================================================
# PASSWORD HASHING
# =====================================================

def hash_password(password: str) -> str:
    """
    Hash le mot de passe avec bcrypt.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie un mot de passe vs son hash.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


# =====================================================
# JWT TOKEN
# =====================================================

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Génère un token JWT signé.
    """

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """
    Décode et valide un token JWT.
    Retourne le payload si valide, sinon lève une exception.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload

    except JWTError:
        raise ValueError("Invalid or expired token")
