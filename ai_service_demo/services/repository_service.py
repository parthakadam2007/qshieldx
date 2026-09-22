from fastapi import HTTPException

from ..schemas.repository import ReposityRequest,ReposityResponse
from ..database.client import db


async def create_repository(request:ReposityRequest) ->ReposityResponse:
    try:
        repo = await db.repository.create(
            data = {
                "project_id":request.project_id,
                "repo_uri" :request.repo_uri,
                "repo_name":request.repo_name,
                "repo_branch":request.repo_branch
            }
        )
        return ReposityResponse.model_validate(repo, from_attributes=True)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


async def get_repositories_by_project_id(project_id: int) -> list[ReposityResponse]:
    repositories = await db.repository.find_many(
        where={"project_id": project_id},
        order=[{"created_at": "desc"}],
    )
    return [
        ReposityResponse.model_validate(repository, from_attributes=True)
        for repository in repositories
    ]