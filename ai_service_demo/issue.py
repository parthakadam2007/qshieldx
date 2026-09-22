import json
import os
import requests
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
GITHUB_REPO = os.getenv("GITHUB_REPO")


def create_github_issue(cbom: dict):
    """
    Create one GitHub issue for every vulnerability found in the CBOM.
    """

    if not GITHUB_TOKEN:
        raise ValueError("GITHUB_TOKEN environment variable is not set")

    if not GITHUB_OWNER or not GITHUB_REPO:
        raise ValueError("GITHUB_OWNER and GITHUB_REPO must be set")

    vulnerabilities = cbom.get("vulnerabilities", [])

    if not vulnerabilities:
        print("No vulnerabilities found.")
        return

    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues"

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    for vulnerability in vulnerabilities:

        vulnerability_id = vulnerability.get("id", "UNKNOWN")
        description = vulnerability.get(
            "description",
            "No description provided."
        )
        recommendation = vulnerability.get(
            "recommendation",
            "No recommendation provided."
        )

        # -------------------------
        # Severity
        # -------------------------

        ratings = vulnerability.get("ratings", [])

        severity = "UNKNOWN"
        score = "N/A"

        if ratings:
            rating = ratings[0]

            severity = rating.get(
                "severity",
                "UNKNOWN"
            ).upper()

            score = rating.get(
                "score",
                "N/A"
            )

        # -------------------------
        # Affected assets
        # -------------------------

        affected_assets = vulnerability.get("affects", [])

        affected_refs = []

        for asset in affected_assets:
            ref = asset.get("ref")

            if ref:
                affected_refs.append(ref)

        affected_text = "\n".join(
            f"- `{ref}`"
            for ref in affected_refs
        )

        if not affected_text:
            affected_text = "- No affected asset information available"

        # -------------------------
        # Issue title
        # -------------------------

        title = (
            f"[QShieldX] "
            f"{severity}: "
            f"{vulnerability_id}"
        )

        # -------------------------
        # Issue body
        # -------------------------

        body = f"""
## 🔐 Cryptographic Vulnerability

Detected automatically by **QShieldX CBOM Scanner**.

### Finding

| Property | Value |
|---|---|
| Vulnerability | `{vulnerability_id}` |
| Severity | `{severity}` |
| Risk Score | `{score}` |
| Scanner | `QShieldX` |

---

## ⚠️ Description

{description}

---

## 🎯 Affected Assets

{affected_text}

---

## 🛠 Recommended Remediation

{recommendation}

---

## 📊 CBOM Information

### Scan

| Property | Value |
|---|---|
| BOM Format | `{cbom.get("bomFormat", "N/A")}` |
| Spec Version | `{cbom.get("specVersion", "N/A")}` |
| CBOM Version | `{cbom.get("version", "N/A")}` |
| Serial Number | `{cbom.get("serialNumber", "N/A")}` |

---

## 🔎 Evidence

"""

        # -------------------------
        # Evidence
        # -------------------------

        evidence = cbom.get("evidence", [])

        if evidence:

            for item in evidence:

                identity = item.get("identity", {})

                file_path = identity.get(
                    "concludedValue",
                    "Unknown"
                )

                methods = identity.get(
                    "methods",
                    []
                )

                body += f"""
### `{file_path}`

"""

                for method in methods:

                    technique = method.get(
                        "technique",
                        "unknown"
                    )

                    confidence = method.get(
                        "confidence",
                        "N/A"
                    )

                    body += (
                        f"- Detection technique: `{technique}`\n"
                        f"- Confidence: `{confidence}`\n"
                    )

                occurrences = item.get(
                    "occurrences",
                    []
                )

                for occurrence in occurrences:

                    location = occurrence.get(
                        "location",
                        "Unknown"
                    )

                    line = occurrence.get(
                        "line",
                        "Unknown"
                    )

                    body += (
                        f"- Location: `{location}`\n"
                        f"- Line: `{line}`\n"
                    )

        else:

            body += (
                "No source-code evidence was provided "
                "by the scanner.\n"
            )

        # -------------------------
        # QShieldX properties
        # -------------------------

        properties = cbom.get(
            "properties",
            []
        )

        qshieldx_properties = {}

        for prop in properties:

            name = prop.get("name")

            value = prop.get("value")

            if name and name.startswith("qshieldx."):

                qshieldx_properties[name] = value

        if qshieldx_properties:

            body += "\n---\n\n## 📈 QShieldX Assessment\n\n"

            for name, value in qshieldx_properties.items():

                readable_name = name.replace(
                    "qshieldx.",
                    ""
                ).replace(
                    ".",
                    " "
                ).title()

                body += (
                    f"- **{readable_name}:** `{value}`\n"
                )

        # -------------------------
        # Footer
        # -------------------------

        body += """
---

## 🤖 QShieldX

This issue was automatically created by the
QShieldX Cryptographic Bill of Materials scanner.

**Next step:** Remediate the vulnerable cryptographic
implementation and trigger another CBOM scan.

> This issue should be automatically closed when the
> vulnerability is no longer detected.
"""

        # -------------------------
        # Labels
        # -------------------------

        labels = [
            "qshieldx",
            "security",
            "cryptography",
            "cbom",
            "quantum-risk",
            severity.lower()
        ]

        payload = {
            "title": title,
            "body": body,
            "labels": labels
        }

        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code == 201:

            issue = response.json()

            print(
                f"Created issue #{issue['number']}: "
                f"{issue['html_url']}"
            )

        else:

            print(
                "Failed to create issue:"
            )

            print(
                response.status_code,
                response.text
            )


if __name__ == "__main__":

    # Load your CBOM
    with open(
        "./cbom.json",
        "r",
        encoding="utf-8"
    ) as file:

        seed_cbom = json.load(file)

    create_github_issue(seed_cbom)