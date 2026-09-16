import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
GITHUB_REPO = os.getenv("GITHUB_REPO")

GITHUB_API = "https://api.github.com"

HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "X-GitHub-Api-Version": "2026-03-10"
}


def github_request(method, endpoint, **kwargs):
    url = f"{GITHUB_API}{endpoint}"

    response = requests.request(
        method,
        url,
        headers=HEADERS,
        **kwargs
    )

    if not response.ok:
        raise Exception(
            f"GitHub API error {response.status_code}: "
            f"{response.text}"
        )

    return response.json() if response.text else None


def get_issue(issue_number):

    return github_request(
        "GET",
        f"/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues/{issue_number}"
    )


def create_issue(title, body):

    return github_request(
        "POST",
        f"/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues",
        json={
            "title": title,
            "body": body
        }
    )


def get_default_branch():

    repo = github_request(
        "GET",
        f"/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
    )

    return repo["default_branch"]


def get_branch_sha(branch):

    result = github_request(
        "GET",
        f"/repos/{GITHUB_OWNER}/{GITHUB_REPO}/git/ref/heads/{branch}"
    )

    return result["object"]["sha"]


def create_branch(branch_name, base_sha):

    return github_request(
        "POST",
        f"/repos/{GITHUB_OWNER}/{GITHUB_REPO}/git/refs",
        json={
            "ref": f"refs/heads/{branch_name}",
            "sha": base_sha
        }
    )


def create_pr(
    title,
    body,
    head,
    base
):

    return github_request(
        "POST",
        f"/repos/{GITHUB_OWNER}/{GITHUB_REPO}/pulls",
        json={
            "title": title,
            "body": body,
            "head": head,
            "base": base
        }
    )


def comment_on_issue(issue_number, body):

    return github_request(
        "POST",
        f"/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
        f"/issues/{issue_number}/comments",
        json={
            "body": body
        }
    )