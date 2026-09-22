from fastapi import APIRouter, Depends

from ..schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from ..services.auth_service import get_current_user, login_user, register_user
from ..models.user import public_user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(request: RegisterRequest):
    return await register_user(request)


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    return await login_user(request)


@router.get("/me")
async def current_user(user=Depends(get_current_user)):
    return public_user(user)
