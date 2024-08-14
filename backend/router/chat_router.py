from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from controller.chat_controller import chatController
import model.model as model

router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"]
)

# 의존성 주입을 위한 채팅 함수
def get_chat_controller() -> chatController:
    return chatController()

# AI 모의 면접 정보 API
@router.post("/bot", response_model=model.Conversation)
async def chat(conversation: model.Conversation, chat: chatController = Depends(get_chat_controller)) -> model.Conversation:
    return chat.additional_question(conversation)

# AI 모의 면접 결과 정보 API
@router.post("/summary", response_model=model.SummaryResponse)
async def summary(summary: model.Summary, chat: chatController = Depends(get_chat_controller)) -> model.SummaryResponse:
    return chat.summary(summary)

# AI 모의 면접 결과 ObejctId 가져오는 API - 
@router.get("/summaryList/{email}", response_model=List[Dict])
async def getSummaryList(email: str, chat: chatController = Depends(get_chat_controller)) -> Dict:
    return chat.summarygetAll(email)

# AI 모의 면접 결과 ObejctId 가져오는 API - 가장 최근 2개 그리고 그걸로 최근 점수 + 면접 기록 2개로 처리하기!
@router.get("/summaryRecent/{email}", response_model=List[Dict])
async def getSummaryList(email: str, chat: chatController = Depends(get_chat_controller)) -> Dict:
    return chat.summarygetRecent(email)