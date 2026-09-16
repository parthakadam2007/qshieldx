import os
import shutil
import tempfile
from git import Repo


def clone_repository():

    token = os.getenv("GITHUB_TOKEN")
    owner = os.getenv("GITHUB_OWNER")
    repo = os.getenv("GITHUB_REPO")

    temp_dir = tempfile.mkdtemp(
        prefix="qshieldx_"
    )

    url = (
        f"https://x-access-token:{token}"
        f"@github.com/{owner}/{repo}.git"
    )

    Repo.clone_from(
        url,
        temp_dir
    )

    return temp_dir