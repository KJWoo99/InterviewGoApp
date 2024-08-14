from fastapi import FastAPI
import router.chat_router as chat_router
import router.user_router as user_router
import router.email_router as email_router
import router.job_router as job_router
import router.rank_router as rank_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key='supersecretkey')

app.include_router(chat_router.router)
app.include_router(user_router.router)
app.include_router(email_router.router)
app.include_router(job_router.router)
app.include_router(rank_router.router)

# if __name__ == "__main__":
#     uvicorn.run("main:app", reload=True)