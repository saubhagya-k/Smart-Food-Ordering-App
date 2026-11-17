"""Entry point for the nutrition service.

Run with:  uvicorn app.main:app --reload --port 8000
(from the Fast_api/backend folder)

It checks the required keys are set, then serves the app defined in
main_agent.py, which holds the /analyze-meal route.
"""
import os

from dotenv import load_dotenv

load_dotenv()

REQUIRED_KEYS = ["GOOGLE_API_KEY", "EDAMAM_APP_ID", "EDAMAM_APP_KEY"]
missing = [key for key in REQUIRED_KEYS if not os.getenv(key)]
if missing:
    raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

from .main_agent import app  # noqa: E402  (import after the key check)

__all__ = ["app"]
