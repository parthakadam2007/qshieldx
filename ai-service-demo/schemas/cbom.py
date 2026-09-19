from pydantic import BaseModel


class CBOMRequest(BaseModel):
    repo_url: str
    branch: str = "main"
