from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, int], additional_claims: Optional[Dict[str, Any]] = None) -> str:
    """Create a JWT access token"""
    to_encode = {"sub": str(subject), "type": "access"}
    if additional_claims:
        to_encode.update(additional_claims)
    
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(subject: Union[str, int]) -> str:
    """Create a JWT refresh token"""
    to_encode = {"sub": str(subject), "type": "refresh"}
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        raise JWTError(f"Could not validate credentials: {str(e)}")

def get_token_user_id(token: str) -> Optional[str]:
    """Extract user ID from token without validation (for debugging)"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"verify_exp": False})
        return payload.get("sub")
    except:
        return None