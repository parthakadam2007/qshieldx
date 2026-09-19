import json

import requests
from fastapi import HTTPException

from common.utils import parse_github_url
from workers.cbomkit import CbomKitClient
from ..schemas.cbom import CBOMRequest


COMPLIANCE_URL = "http://localhost:8081/api/v1/compliance/check"


def generate_cbom(request: CBOMRequest) -> dict:
    try:
        repo_identifier, git_url, commit_hash = parse_github_url(
            request.repo_url,
            request.branch,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    client = CbomKitClient()
    cbom, duration, error = client.generate_cbom(
        git_url=git_url,
        branch=request.branch,
    )
    if error:
        raise HTTPException(status_code=500, detail=error)

    cbom_data = json.loads(cbom)
    try:
        compliance_response = requests.post(
            COMPLIANCE_URL,
            params={"policyIdentifier": "quantum_safe"},
            json=cbom_data["bom"],
            timeout=30,
        )
        compliance_response.raise_for_status()
        quantum_check = compliance_response.json()
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Quantum compliance service timed out")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Could not connect to CBOMkit compliance service")
    except requests.exceptions.HTTPError as error:
        raise HTTPException(status_code=502, detail=f"Quantum compliance check failed: {error}")
    except (ValueError, KeyError):
        raise HTTPException(status_code=502, detail="Compliance service returned invalid JSON")

    return {
        "repository": repo_identifier,
        "git_url": git_url,
        "branch": request.branch,
        "commit": commit_hash,
        "duration": duration,
        "cbom": cbom,
        "quantum_compliance": quantum_check,
    }
