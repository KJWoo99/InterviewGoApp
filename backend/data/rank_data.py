from fastapi import HTTPException, status
from bson import ObjectId
from database.mongo import MongoDB
import numpy as np

class Rank(MongoDB):
    def __init__(self) -> None:
        super().__init__('interview')

    def objectIdToStr(self, documents):
        for doc in documents:
            for key, value in doc.items():
                if isinstance(value, ObjectId):
                    doc[key] = str(value)
        return documents

    def getRankList(self):
        pipeline = [
            {
                "$group": {
                    "_id": "$email",
                    "username": { "$first": "$username" },
                    "max_score": { "$max": "$result.score" },
                    "createdAt": { "$first": "$createdAt" },
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "email": "$_id",
                    "username": 1,
                    "max_score": 1,
                    "createdAt": 1,
                }
            },
            {
                "$sort": {
                    "max_score": -1,
                    "createdAt": -1
                }
            }
        ]

        results = list(self.collection.aggregate(pipeline))

        if not results:
            raise HTTPException(status_code=404, detail="등록된 랭킹 데이터가 없습니다!")

        # ObjectId를 문자열로 변환
        results = self.objectIdToStr(results)

        # 순위를 계산
        for i, doc in enumerate(results):
            doc['rank'] = i + 1

        return results

    def getRankAll(self):
        return self.getRankList()
    
    def topPresent(self, email):
        all_max_scores = self.getRankList()

        # 특정 사용자의 랭크를 가져옴
        user_rank_doc = next((doc for doc in all_max_scores if doc["email"] == email), None)
        if not user_rank_doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"랭크가 등록되어있지 않습니다.")

        user_rank = user_rank_doc["rank"]
        username = user_rank_doc["username"]
        total_users = len(all_max_scores)

        # 상위 백분위 계산
        
        top_percentile = (user_rank / total_users) * 100
        return {"username": username, "ranking": f"{top_percentile:.2f}"}
