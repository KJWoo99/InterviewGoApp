from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from controller.user_controller import userController
from model import model
from validation.auth import AuthRequired

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

# 의존성 주입을 위한 회원 함수
def get_User_controller() -> userController:
    return userController()

# 로그인 - jwt 토큰 반환 API
@router.post('/login')
async def userLogin(form_data: OAuth2PasswordRequestForm = Depends(), user_controller: userController = Depends(get_User_controller)):
    token = user_controller.authenticate_user(form_data.username, form_data.password)
    return {"token": token, "token_type": "Bearer"}

# 회원가입 - 완료 후 성공했다는 상태 메세지 전송 API
@router.post('/register')
async def userSign(user: model.User, user_controller: userController = Depends(get_User_controller)):
    token = user_controller.create_user(user)
    return {"token": token, "token_type": "Bearer"}

# 패스워드 잊었을 경우 요청시 알려주는 API
@router.post('/checkpassword')
async def userPassword(email: str, user_controller: userController = Depends(get_User_controller)):
    password = user_controller.check_password(email)
    return {"password": password}

# 회원정보 수정 - 패스워드 수정 API
@router.put('/update')
async def userUpdate(user: model.UpdateAccount, user_controller: userController = Depends(get_User_controller), current_user: dict = Depends(AuthRequired())):
    message = user_controller.update_user(model.User(email=current_user.username, password=user.password, username=user.username, job=user.job))
    return message

# 회원정보 삭제 - 회원 탈퇴 API
@router.delete('/delete')
async def userDelete(user_controller: userController = Depends(get_User_controller), current_user: dict = Depends(AuthRequired())):
    message = user_controller.delete_user(current_user.username)
    return message

@router.post('/me')
async def userMe(user_controller: userController = Depends(get_User_controller), current_user: dict = Depends(AuthRequired())):
    result = user_controller.check_user(current_user)
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return result