from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from urllib.parse import unquote
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import json
load_dotenv()

from .issue import create_github_issue
from pydantic import BaseModel
from common.utils import parse_github_url
from workers.cbomkit import  CbomKitClient
from .auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    db,
    get_current_user,
    login_user,
    register_user,
)

@asynccontextmanager
async def lifespan(_app: FastAPI):
    await db.connect()
    try:
        yield
    finally:
        await db.disconnect()


app = FastAPI(
    title="My API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React/Vite
        "http://localhost:3000",  # Next.js / React
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/auth/register", response_model=TokenResponse, status_code=201)
async def register(request: RegisterRequest):
    return await register_user(request)


@app.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    return await login_user(request)


@app.get("/auth/me")
async def current_user(user=Depends(get_current_user)):
    return {
        "user_id": int(user.user_id),
        "user_name": user.user_name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at,
    }

@app.get("/make_isse")
async def root(_user=Depends(get_current_user)):
        # Load your CBOM
    with open(
        "D://qshieldx//cbom.json",
        "r",
        encoding="utf-8"
    ) as file:

        seed_cbom = json.load(file)
    create_github_issue(seed_cbom)
    return {"message": "Hello World"}



class CBOMRequest(BaseModel):
    repo_url: str
    branch: str = "main"

# @app.post("/cbom")
# def generate_cbom(request: CBOMRequest):

#     client = CbomKitClient()

#     cbom, duration, error = client.generate_cbom(
#         git_url=request.repo_url,
#         branch=request.branch
#     )

#     if error:
#         raise HTTPException(
#             status_code=500,
#             detail=error
#         )

#     return {
#         "repository": request.repo_url,
#         "branch": request.branch,
#         "duration": duration,
#         "cbom": cbom
#     }

# @app.post("/cbom")
# def generate_cbom(request: CBOMRequest):

#     try:
#         repo_identifier, git_url, commit_hash = parse_github_url(
#             request.repo_url,
#             request.branch
#         )

#     except ValueError as e:
#         raise HTTPException(
#             status_code=400,
#             detail=str(e)
#         )

#     client = CbomKitClient()

#     cbom, duration, error = client.generate_cbom(
#         git_url=git_url,
#         branch=request.branch
#     )

#     if error:
#         raise HTTPException(
#             status_code=500,
#             detail=error
#         )

#     return {
#         "repository": repo_identifier,
#         "git_url": git_url,
#         "branch": request.branch,
#         "commit": commit_hash,
#         "duration": duration,
#         "cbom": cbom
#     }


import requests


COMPLIANCE_URL = (
    "http://localhost:8081/api/v1/compliance/check"
)


@app.post("/cbom")
def generate_cbom(request: CBOMRequest, _user=Depends(get_current_user)):

    # 1. Validate + parse GitHub URL
    try:
        repo_identifier, git_url, commit_hash = parse_github_url(
            request.repo_url,
            request.branch
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    # 2. Generate CBOM
    client = CbomKitClient()

    cbom, duration, error = client.generate_cbom(
        git_url=git_url,
        branch=request.branch
    )

    if error:
        raise HTTPException(
            status_code=500,
            detail=error
        )

    # 3. Quantum-safe compliance check

    cbom_data = json.loads(cbom)
    try:

        compliance_response = requests.post(
            COMPLIANCE_URL,
            params={
                "policyIdentifier": "quantum_safe"
            },
            json=cbom_data["bom"],
            timeout=30
        )

        compliance_response.raise_for_status()

        quantum_check = compliance_response.json()

    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Quantum compliance service timed out"
        )

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to CBOMkit compliance service"
        )

    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Quantum compliance check failed: {str(e)}"
        )

    except ValueError:
        raise HTTPException(
            status_code=502,
            detail="Compliance service returned invalid JSON"
        )

    # 4. Return everything
    return {
        "repository": repo_identifier,
        "git_url": git_url,
        "branch": request.branch,
        "commit": commit_hash,
        "duration": duration,

        "cbom": cbom,

        "quantum_compliance": quantum_check
    }