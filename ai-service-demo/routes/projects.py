from fastapi import APIRouter, Depends

from ..models.project import project_response
from ..schemas.project import ProjectCreateRequest, ProjectResponse
from ..services.auth_service import get_current_user
from ..services.project_service import create_project, get_user_projects


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectResponse])
async def get_projects_route(user=Depends(get_current_user)):
    return await get_user_projects(user)


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project_route(
    request: ProjectCreateRequest,
    user=Depends(get_current_user),
):
    return await create_project(request, user)
