from typing import Any, Dict
from fastapi import Depends, HTTPException, status
from starlette.requests import Request
from fastapi.security import HTTPBearer
import model.model as model
import jwt
from config import key
from datetime import datetime, timezone, timedelta

class AuthRequired(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(AuthRequired, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized user cannot access",
                headers={"WWW-Authenticate": "Bearer"},
            )

        try:
            token_type, token = auth_header.split(" ")
            if token_type != "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            token_info = self.verify_token(token)
            return token_info
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, key["jwt"]["SECRETKEY"], algorithms=["HS256"])
            exp_timestamp = payload["exp"]
            
            exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
            current_datetime = datetime.now(timezone.utc)

            if exp_datetime < current_datetime:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            username = payload.get("sub")
            return model.TokenData(username=username)
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )            

    # data는 이메일임. 추가 데이터를 넣으면 그 내용을 encode하면 안에 넣을 수 있음
    def create_token(self, data: Dict[str, Any], expires_delta: timedelta = timedelta(minutes=key["jwt"]["ACCESS_TOKEN_EXPIRE_MINUTES"])) -> str:
            to_encode = data.copy()
            expire = datetime.now(timezone.utc) + expires_delta
            to_encode.update({"exp": expire})
            encoded_jwt = jwt.encode(to_encode, key["jwt"]["SECRETKEY"], algorithm="HS256")
            return encoded_jwt

    def update_token(self, token: str, expires_delta: timedelta = timedelta(minutes=key["jwt"]["ACCESS_TOKEN_EXPIRE_MINUTES"])):
        expire = datetime.now(timezone.utc) + expires_delta
        token.update({"exp": expire})
        return token