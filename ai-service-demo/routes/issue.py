from fastapi import APIRouter, Depends

from ..services.auth_service import get_current_user
from ..services.issue_service import create_issue_from_file


router = APIRouter(tags=["issues"])


@router.get("/make_isse")
async def make_issue(_user=Depends(get_current_user)):
    create_issue_from_file("D://qshieldx//cbom.json")
    return {"message": "Hello World"}
