def project_response(project) -> dict:
    return {
        "project_id": int(project.project_id),
        "project_name": project.project_name,
        "user_id": int(project.user_id),
        "created_at": project.created_at,
        "updated_at": project.updated_at,
    }
