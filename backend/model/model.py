from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    
######################################

# 로그인 모델
class Login(BaseModel):
    email: str
    password: str

# 회원가입 모델
class User(BaseModel):
    email: str
    password: str
    username: str
    job: str

    @field_validator('*')
    @classmethod
    def check_not_empty(cls, v: str):
        if not v or v.strip() == "":
            raise ValueError("값이 비었습니다!")
        return v

class PasswordUpdate(BaseModel):
    email: str
    newpassword: str
    token: str

# 요청 모델
class UpdateAccount(BaseModel):
    username: str
    password: str
    job: str

    @field_validator('*')
    @classmethod
    def check_not_empty(cls, v: str):
        if not v or v.strip() == "":
            raise ValueError("값이 비었습니다!")
        return v

class DeleteAccount(BaseModel):
    email: str

######################################

# 이메일 코드 요청 모델
class EmailRequest(BaseModel):
    email: str
    
    @field_validator('email')
    @classmethod
    def check_not_empty(cls, v: str):
        if not v or v.strip() == "":
            raise ValueError("값이 비었습니다!")
        return v

#이메일 코드 인증 모델
class EmailVerifyCode(BaseModel):
    code: str
    @field_validator('code')
    @classmethod
    def check_not_empty(cls, v: str):
        if not v or v.strip() == "":
            raise ValueError("값이 비었습니다!")
        return v

######################################

# 추가 질문용 모델
class Conversation(BaseModel):
    question: str
    answer: str
    position: str
    is_additional_question: bool
    additional_count: int

# 결과 제출용 모델
class Summary(BaseModel):
    title: str = Field("notitle", description="The summary number")
    conversations: List[Conversation]
    result: Optional[dict] = None
    username: str
    email: str
    createdAt: Optional[str] = None

# 결과에 따른 총평 결과 응답 모델
class SummaryResponse(BaseModel):
    score: int
    strengths: str
    weaknesses: str
    delivery: str
    total: str
