from fastapi import APIRouter, Depends

from ..schemas.cbom import CBOMRequest
from ..services.auth_service import get_current_user
from ..services.cbom_service import generate_cbom


router = APIRouter(tags=["cbom"])


@router.post("/cbom")
def generate_cbom_route(
    request: CBOMRequest,
    _user=Depends(get_current_user),
):
    return generate_cbom(request)
