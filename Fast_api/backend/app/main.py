from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from .agents.food_parser import FoodParserAgent
from .tools.edamam_tool import EdamamTool
import json
import re
import os  # <-- ADD THIS IMPORT

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()  # <-- ADD THIS LINE

# Initialize FastAPI
app = FastAPI()

# --- READ SECRETS FROM ENVIRONMENT ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID")
EDAMAM_APP_KEY = os.getenv("EDAMAM_APP_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3001")  # Fallback to local

# Validate they exist (crash early if missing)
if not all([GOOGLE_API_KEY, EDAMAM_APP_ID, EDAMAM_APP_KEY]):
    raise ValueError("Missing required API keys in environment variables!")

# --- FIXED CORS (No more hardcoded localhost!) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Reads from .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THE REST OF YOUR CODE ---
# Initialize agents and tools (we'll pass the keys to them)
parser = FoodParserAgent(api_key=GOOGLE_API_KEY)  # <-- We'll update parser to accept this
edamam = EdamamTool(app_id=EDAMAM_APP_ID, app_key=EDAMAM_APP_KEY)  # <-- Update tool

# ... Keep the rest of your routes (analyze_meal, etc.) exactly as they are ...