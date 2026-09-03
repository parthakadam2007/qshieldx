import os
from typing import Dict, Any, List

class LLMProvider:
    """
    Abstract LLM Provider prioritizing GEMINI_API_KEY.
    """
    def __init__(self):
        self.gemini_key = os.environ.get("GEMINI_API_KEY")
        self.openai_key = os.environ.get("OPENAI_API_KEY")
        
        if self.gemini_key:
            self.provider = "gemini"
        elif self.openai_key:
            self.provider = "openai"
        else:
            self.provider = "mock"

    def get_provider_name(self) -> str:
        return self.provider

    def planner_reasoning(self, input_data: Any) -> str:
        if self.provider == "mock":
            return "Mock reasoning generated: proceed with execution."
        return "Reasoning generated."

    def generate_summary(self, findings: List[Dict[str, Any]]) -> str:
        if self.provider == "mock":
            return "Mock Summary: Several vulnerabilities were identified."
        return f"Generated summary for {len(findings)} findings."

    def generate_cbom_summary(self, data: Any) -> str:
        if self.provider == "mock":
            return "Mock CBOM Summary: 5 cryptographic assets detected."
        return "CBOM summary generated."

    def generate_migration_report(self, data: Any) -> str:
        if self.provider == "mock":
            return "Mock Migration Report: Transition to AES-256."
        return "Migration report generated."

# Global instance for easy import
llm = LLMProvider()
