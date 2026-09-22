from datetime import datetime

from pydantic import BaseModel, Field


class ProjectCreateRequest(BaseModel):
    project_name: str = Field(min_length=1, max_length=255)


class ProjectResponse(BaseModel):
    project_id: int
    project_name: str
    user_id: int
    created_at: datetime
    updated_at: datetime
