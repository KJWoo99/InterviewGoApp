from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi import Form, Request, HTTPException, status
from data.user_data import UserData
from config import key
import random
import string

class Email:
    def __init__(self) -> None:
        self.conf = ConnectionConfig(
            MAIL_USERNAME=key["email"]["MAIL_USERNAME"],
            MAIL_PASSWORD=key["email"]["MAIL_PASSWORD"],
            MAIL_FROM=key["email"]["MAIL_FROM"],
            MAIL_PORT=465,
            MAIL_SERVER='smtp.gmail.com',
            MAIL_STARTTLS=False,
            MAIL_SSL_TLS=True,
            USE_CREDENTIALS=True
        )

        self.user_data = UserData()

    def generate_code(self):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    
    async def send_code(self, request: Request, recipient: str = Form(...)):
        session = request.session
        code = self.generate_code()
        session['code'] = code
        session['recipient'] = recipient

        message = MessageSchema(
            subject="InterviewLab 인증 코드",
            recipients=[recipient],
            body=f"인증 코드는 {code}입니다.",
            subtype="plain"
        )
        
        fm = FastMail(self.conf)
        await fm.send_message(message)  # 비동기 메서드 호출 시 await 사용

        return {"message": "인증코드가 발송되었습니다."}
    
    async def send_password(self, recipient: str = Form(...)):
        user = self.user_data.get_user(recipient)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Code not found")

        message = MessageSchema(
                    subject="InterviewLab 패스워드 확인 요청",
                    recipients=[recipient],
                    body=f"가입하신 {user.email}의 패스워드는 {user.password}입니다.",
                    subtype="plain"
                )
        
        fm = FastMail(self.conf)
        await fm.send_message(message)  # 비동기 메서드 호출 시 await 사용

        return {"message": "메일이 발송되었습니다."}
    
    async def verify_code(self, request: Request, code: str = Form(...)):
        if not code:
            return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Code not found")

        session = request.session
        if code == session.get('code'):
            session.pop('code', None)
            session.pop('recipient', None)
            return {"result": True}
        else:
            return {"result": False}