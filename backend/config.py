import os
from dotenv import load_dotenv

load_dotenv()

# 각종 상수 값(api 키, database 등)을 모아놓는 곳
# jwt하고 bcrypt의 경우 예상으로 넣어놓은 것, 확정 아님.
# 이 코드는 반드시 .env 파일이 있고, 해당 키 값이 있어야 키 안의 값을 가져올 수 있다.
key = {
    "jwt": {
        "SECRETKEY": os.getenv("SECRETKEY"),
        "ACCESS_TOKEN_EXPIRE_MINUTES": int(os.getenv("TOKEN_EXPIRE"))
    },
    "bcrypt": {
        "saltRounds": "임시",
    },
    "openai": {
        "api": os.getenv("OPENAI_API_KEY")
    },
    "db": {
        "api": os.getenv("MONGO_API_KEY")
    },
    "email": {
        "MAIL_USERNAME": os.getenv('MAIL_USERNAME'),
        "MAIL_PASSWORD": os.getenv('MAIL_PASSWORD'),
        "MAIL_FROM": os.getenv('MAIL_FROM')
    }
}