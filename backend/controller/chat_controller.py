from fastapi import HTTPException
from data.chat_data import chatLog
import model.model as model
import random
import datetime

class chatController:
    def __init__(self) -> None:
        self.chatlog = chatLog()
        
    # 추가 질문
    def additional_question(self, conversation: model.Conversation):
        print(conversation)

        result = model.Conversation(
            question="",
            answer="",
            position=conversation.position,
            is_additional_question=False,
            additional_count=0
        )

        if conversation.is_additional_question:
            # 추가질문 걸리는 것
            chance = random.random()
            if chance > 0.5 and conversation.additional_count < 1:
                # 추가 질문 생성하기
                result.question = self.chatlog.responseAdditionalQuestion(conversation)
                result.is_additional_question = True
                result.additional_count = conversation.additional_count + 1
            else:
                # 대질문 넘어가기
                result.additional_count = 0
        else:
            # 일반 질문 생성하기
            result.question = self.chatlog.responseAdditionalQuestion(conversation)
            result.is_additional_question = True
        
        print(result)
        return result
    

    # 결과 내기 및 저장
    def summary(self, summary):
        today_dt = datetime.datetime.now()
        summary.createdAt = today_dt.strftime("%Y-%m-%d")
        # 혹시라도 gpt가 형식 제대로 안 갖췄을 때의 대비
        try:
            summary_result = self.chatlog.responseSummary(summary.conversations)
            summary.result = summary_result

            # db 저장
            self.chatlog.summaryInsert_with_limit(summary)

            return model.SummaryResponse(**summary_result)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def summarygetAll(self, email: str):
        return self.chatlog.summaryfindAll(email)
    
    def summarygetRecent(self, email: str):
        return self.chatlog.summaryfindRecent(email)