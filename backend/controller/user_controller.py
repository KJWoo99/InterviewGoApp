from datetime import datetime, timedelta
from typing import Any, Dict
import jwt
from fastapi import HTTPException, Response, status
from model import model
from config import key
from data.user_data import UserData
from data.chat_data import chatLog
# from ..validation.auth import create_token

class userController:
    def __init__(self):
        self.userdata = UserData()
        self.chatlog = chatLog()

    def create_user(self, user: model.User) -> str:
        create_check = self.userdata.create_user(user)
        if create_check:
            return self.create_access_token({"sub": user.email})
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    def check_user(self, tokendata: model.TokenData) -> model.User:
        return self.userdata.get_user(tokendata.username)

    # auth -> token -> return token
    def authenticate_user(self, email: str, password: str) -> str:
        user = self.userdata.get_user(email)
        if user and user.password == password:
            return self.create_access_token({"sub": email})
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    def create_access_token(self, data: Dict[str, Any], expires_delta: timedelta = timedelta(minutes=key["jwt"]["ACCESS_TOKEN_EXPIRE_MINUTES"])) -> str:
        to_encode = data.copy()
        expire = datetime.now() + expires_delta
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, key["jwt"]["SECRETKEY"], algorithm="HS256")
        return encoded_jwt

    def check_password(self, email: str) -> str:
        user = self.userdata.get_user(email)
        if user:
            return user.password
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    def update_user(self, user: model.User) -> str:
        user_update = self.userdata.update_user(user)
        user_summary_update = self.chatlog.summaryUsernameUpdate(user)

        if(user_update and user_summary_update):
            return Response(content="회원 정보가 수정되었습니다.", status_code=200)
        else:
            raise HTTPException(status_code=404, detail="회원 정보를 찾을 수 없습니다!")

    def delete_user(self, email: str) -> str:
        user_delete = self.userdata.delete_user(email)
        user_summary_delete = self.chatlog.summaryUsernameDelete(email)

        if(user_delete and user_summary_delete):
            return Response(content="회원탈퇴가 성공적으로 이루어졌습니다.", status_code=200)
        else:
            raise HTTPException(status_code=404, detail="회원의 면접 정보를 찾을 수 없습니다!")
