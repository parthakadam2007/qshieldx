import json

from ..issue import create_github_issue


def create_issue_from_file(path: str) -> None:
    with open(path, "r", encoding="utf-8") as file:
        create_github_issue(json.load(file))
