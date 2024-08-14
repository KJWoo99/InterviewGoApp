from typing import Dict, List
from fastapi import HTTPException
from database.mongo import MongoDB
from chatgpt.chatgpt import chatgpt
from pymongo.errors import OperationFailure
from model import model

class chatLog(MongoDB):
    def __init__(self) -> None:
        super().__init__('interview')
        self.chatbot = chatgpt()
    
    # 추가 질문
    def responseAdditionalQuestion(self, conversation):
        # api 없을 경우 에러 처리
        try:
            return self.chatbot.get_openai_response(conversation.question, conversation.answer, conversation.position)
        except Exception as e:
            print(f"Failed to get additional question response: {e}")
            return None
    
    # 결과 응답
    def responseSummary(self, conversation_log):
        # api 없을 경우 에러 처리
        try:
            return self.chatbot.get_openai_summary_response(conversation_log)
        except Exception as e:
            print(f"Failed to get summary response: {e}")
            return None

    # 면접 기록(Log) 생성
    def summaryInsert_with_limit(self, summary, limit=10):
        try:
            # basemodel 객체가 가지고 있는 형변환 메소드
            doc = summary.dict()
            # 일단 행 하나 삽입
            self.collection.insert_one(doc)
            # 행 개수를 세는데, 이때 username과 일치하는 게 몇 개인지 셈
            if self.collection.count_documents({'username': summary.username}) > limit:
                # 만약 10개 넘었다면 가장 오래된 ObjectId를 가져와서 삭제
                oldest_doc = self.collection.find_one({'username': summary.username}, sort=[('_id', 1)])
                self.collection.delete_one({'_id': oldest_doc['_id']})
        except Exception as e:
            print(f"Failed to insert or limit documents: {e}")

    # 면접 기록 버튼 목록 - 전체
    def summaryfindAll(self, email: str) -> List[Dict]:
        try:
            documents = list(self.collection.find(
                {'email': email},
                {'_id': 1, 'title': 1, 'result': 1, 'createdAt': 1}
            ).sort('_id', -1))  # 최근 순으로 정렬

            result_docs = []
            for doc in documents:
                doc['_id'] = str(doc['_id'])
                if 'result' in doc:
                    # result 필드의 내용을 최상위 필드로 추출
                    result = doc.pop('result')
                    doc.update(result)
                result_docs.append(doc)
                
            return result_docs
        except OperationFailure:
            raise HTTPException(status_code=500, detail="Failed to find documents")
        
    # 면접 기록 버튼 목록 - 2개
    def summaryfindRecent(self, email):
        try:
            # 최근 2개의 기록을 가져오기 위해 정렬 및 제한 추가
            documents = list(self.collection.find(
                {'email': email},
                {'_id': 0, 'title': 1, 'result': 1, 'createdAt': 1}
            ).sort('_id', -1).limit(2))
            
            for doc in documents:
                if 'result' in doc:
                    # result 필드의 score를 최상위로 올림
                    result = doc.pop('result')
                    doc['score'] = result.get('score')
                
            return documents
        except OperationFailure:
            raise HTTPException(status_code=500, detail="Failed to find documents")
        
    def summaryUsernameUpdate(self, user: model.User):
        try:
            result = self.collection.update_many(
                {"email": user.email},
                {"$set": {"username": user.username}}
            )
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="사용자의 면접 기록을 찾을 수 없습니다.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        return True
        
    def summaryUsernameDelete(self, email: str):
        try:
            self.collection.delete_many({"email": email})
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
        return True