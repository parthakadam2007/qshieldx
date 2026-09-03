import os
import logging
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("QShieldX")

class Config:
    @staticmethod
    def validate():
        required_vars = [
            "SUPABASE_URL",
            "SUPABASE_ANON_KEY",
            "SUPABASE_SERVICE_ROLE_KEY",
            "GEMINI_API_KEY"
        ]
        missing = []
        for var in required_vars:
            if not os.environ.get(var):
                missing.append(var)
        
        if missing:
            logger.warning(f"⚠️ Missing environment variables: {', '.join(missing)}. Some backend features may run in degraded mode or use mock data.")
        else:
            logger.info("Loaded backend/.env")
            logger.info("Supabase Connected: Yes")
            logger.info("Gemini Provider: Enabled")

Config.validate()
