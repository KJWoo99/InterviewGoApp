from fastapi import APIRouter, Depends, HTTPException, Request, Form, status
from pydantic import ValidationError
from validation.email import Email
import model.model as model

router = APIRouter(
    prefix="/email",
    tags=["email"]
)

email_handler = Email()

@router.post("/sendEmailCode")
async def send_code(request: Request, email: str = Form(...)):
    try:
        email_model = model.EmailRequest(email=email)
    except ValidationError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"User creation failed: {e}")
    return await email_handler.send_code(request, recipient=email_model.email)

@router.post("/sendEmailPassword")
async def send_password(email: str = Form(...)):
    try:
        email_model = model.EmailRequest(email=email)
    except ValidationError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"User creation failed: {e}")
    return await email_handler.send_password(recipient=email_model.email)

@router.post("/verifycode")
async def verify_code(request: Request, emailCode: str = Form(...)):
    try:
        verifymodel = model.EmailVerifyCode(code=emailCode)
    except ValidationError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"User creation failed: {e}")
    return await email_handler.verify_code(request, code=verifymodel.code)