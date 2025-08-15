from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError,jwt
from server.database import get_db
from server.models import User
import os
from dotenv import load_dotenv

load_dotenv()

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token:str=Depends(oauth2_scheme),db:Session=Depends(get_db))->User:
    print("🔍 get_current_user called")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload=jwt.decode(
            token,
            os.getenv('SECRET_KEY'),
            algorithms=[os.getenv("ALGORITHM")]
        )
        print(payload)
        user_id:str=payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user=db.query(User).filter(User.user_id==int(user_id)).first()
    print(user.user_id)
    if user is None:
        raise credentials_exception
    return user
        
    
     
