# routes/auth.py - VERSION AMÉLIORÉE

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
from bson import ObjectId
from mongo import db, get_user_by_email

router = APIRouter()

# Configuration
SECRET_KEY = "your-secret-key-CHANGE-THIS-IN-PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ============ MODÈLES ============
class UserRegister(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    user_id: str
    email: str

class RegisterResponse(BaseModel):
    message: str
    user_id: str
    access_token: str  # ← Token ajouté
    token_type: str

# ============ FONCTIONS UTILITAIRES ============
def hash_password(password: str) -> str:
    # Bcrypt a une limitation de 72 bytes, on tronque si nécessaire
    # Convertir en bytes pour vérifier la longueur
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password = password_bytes[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Bcrypt a une limitation de 72 bytes, on tronque si nécessaire
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        plain_password = password_bytes[:72].decode('utf-8', errors='ignore')
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)
    if not user or not verify_password(password, user["password"]):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db["users"].find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user

# ============ ROUTES ============

@router.post("/register", response_model=RegisterResponse, tags=["Authentication"])
def register(user: UserRegister):
    """
    Register a new user and return access token immediately
    """
    # Vérifier si l'utilisateur existe
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="User already exists")

    # Créer l'utilisateur
    try:
        hashed_pw = hash_password(user.password)
        user_id = db["users"].insert_one({
            "email": user.email,
            "password": hashed_pw,
            "created_at": datetime.utcnow()
        }).inserted_id
        
        # ✨ NOUVEAU : Créer le token automatiquement
        access_token = create_access_token(
            data={"sub": str(user_id)},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        print(f"✓ User registered with auto-login: {user.email}")
        
        return {
            "message": "User registered successfully",
            "user_id": str(user_id),
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        print(f"✗ Registration failed: {e}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login", response_model=Token, tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login with email/password and get access token
    """
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(
        data={"sub": str(user["_id"])}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    print(f"✓ User logged in: {user['email']}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse, tags=["Authentication"])
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get current user information (requires valid token)
    """
    return {
        "user_id": str(current_user["_id"]),
        "email": current_user["email"]
    }


@router.post("/refresh", response_model=Token, tags=["Authentication"])
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """
    Refresh access token (requires valid token)
    """
    access_token = create_access_token(
        data={"sub": str(current_user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    print(f"✓ Token refreshed for: {current_user['email']}")
    return {"access_token": access_token, "token_type": "bearer"}

