from pydantic import BaseModel
from datetime import datetime


class ReposityRequest(BaseModel):
    project_id: int
    repo_uri: str 
    repo_name:str
    repo_branch:str

class ReposityResponse(BaseModel):
    repository_id:int 

    project_id: int

    repo_uri: str 
    repo_name:str
    repo_branch:str
    
    created_at: datetime
    updated_at: datetime