from fastapi import HTTPException, Response, status
from database.mongo import MongoDB
from bson import ObjectId
from model import model

class UserData(MongoDB):
    def __init__(self):
        super().__init__('user')

    def create_user(self, user: model.User) -> str:
        existing_user = self.collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
        
        self.collection.insert_one(user.model_dump())
        return True

    def get_user(self, email: str) -> model.User:
        user_data = self.collection.find_one({"email": email}, {"_id": 0})
        if user_data:
            return model.User(**user_data)
        return None

    def update_user(self, user: model.User) -> bool:
        try:
            result = self.collection.update_one({"email": user.email}, {"$set": {"username": user.username, "password": user.password, "job": user.job}})

            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="회원 정보를 찾을 수 없습니다!")
            
            # 문서는 있지만 수정된 내용이 없는 경우
            if result.modified_count == 0:
                raise HTTPException(status_code=304, detail="업데이트할 내용이 없거나 이미 최신 상태입니다.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
        return True

    def delete_user(self, email: str) -> bool:
        try:
            self.collection.delete_one({"email": email})
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
        return True
