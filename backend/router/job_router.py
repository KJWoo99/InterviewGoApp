from fastapi import APIRouter, Depends
from controller.job_controller import jobController

router = APIRouter(
    prefix="/job",
    tags=["job"]
)

def get_Job_controller() -> jobController:
    return jobController()

@router.get("/card")
async def employment(job_controller: jobController = Depends(get_Job_controller)):
    return job_controller.getJobData()