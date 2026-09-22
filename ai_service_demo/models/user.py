def public_user(user) -> dict:
    return {
        "user_id": int(user.user_id),
        "user_name": user.user_name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at,
    }
