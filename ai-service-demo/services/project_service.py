from ..database.client import db
from ..models.project import project_response
from ..schemas.project import ProjectCreateRequest, ProjectResponse


async def create_project(request: ProjectCreateRequest, user) -> ProjectResponse:
    project = await db.project.create(
        data={
            "project_name": request.project_name.strip(),
            "user_id": user.user_id,
        }
    )
    return ProjectResponse.model_validate(project_response(project))


async def get_user_projects(user) -> list[ProjectResponse]:
    projects = await db.project.find_many(
        where={"user_id": user.user_id},
        order=[{"created_at": "desc"}],
    )
    return [
        ProjectResponse.model_validate(project_response(project))
        for project in projects
    ]
