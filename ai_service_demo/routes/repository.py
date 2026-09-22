from fastapi import APIRouter, Depends

from ..schemas.repository import ReposityRequest, ReposityResponse
from ..services.auth_service import get_current_user
from ..services.repository_service import (
	create_repository,
	get_repositories_by_project_id,
)


router = APIRouter(prefix="/projects", tags=["repositories"])


@router.get(
	"/{project_id}/repositories",
	response_model=list[ReposityResponse],
)
async def get_project_repositories_route(
	project_id: int,
	user=Depends(get_current_user),
):
	return await get_repositories_by_project_id(project_id)


@router.post(
	"/repositories",
	response_model=ReposityResponse,
	status_code=201,
)
async def create_project_repository_route(
	request: ReposityRequest,
	user=Depends(get_current_user),
):
	request = request.model_copy()
	return await create_repository(request)
