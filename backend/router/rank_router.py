from fastapi import APIRouter, Depends
from controller.rank_controller import RankController

router = APIRouter(
    prefix="/rank",
    tags=["rank"]
)

def get_Rank_controller() -> RankController:
    return RankController()

@router.get('/ranklist')
async def ranking(rank_controller: RankController = Depends(get_Rank_controller)):
    return rank_controller.getRankList()

@router.get("/percentages")
async def employment(email: str, rank_controller: RankController = Depends(get_Rank_controller)):
    return rank_controller.getUserTopPresent(email)