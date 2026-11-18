from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from .agents.food_parser import FoodParserAgent
from .tools.edamam_tool import EdamamTool
import json
import os
import re
from dotenv import load_dotenv

load_dotenv()

# Initialize FastAPI
app = FastAPI()

# CORS for React (set FRONTEND_URL in .env when deployed)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3001")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents and tools
parser = FoodParserAgent()
edamam = EdamamTool()

# Daily calorie goal
DAILY_CALORIE_GOAL = 2000

class FoodRequest(BaseModel):
    description: str
    user_id: Optional[str] = "anonymous"

class FoodResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    api_calls: Dict[str, int]

def extract_calories_from_text(text: str) -> Optional[Dict]:
    """Extract embedded calories from text like '350 Kcal/100g'"""
    pattern = r'(\d+)\s*K?cal\s*(?:/|per)?\s*(\d*)\s*g?'
    match = re.search(pattern, text, re.IGNORECASE)
    
    if match:
        calories = float(match.group(1))
        grams = float(match.group(2)) if match.group(2) else 100
        return {
            "calories_per_100g": calories,
            "serving_size": grams
        }
    return None

@app.post("/analyze-meal", response_model=FoodResponse)
async def analyze_meal(request: FoodRequest):
    api_calls = {"gemini": 0, "edamam": 0, "cache_hits": 0}
    
    try:
        # STEP 1: Parse with Gemini
        print(f"\n🔍 STEP 1: Parsing: {request.description}")
        parsed_items = parser.parse_description(request.description)
        api_calls["gemini"] = 1
        
        # Check for embedded calories in original description
        embedded_calories = extract_calories_from_text(request.description)

        final_items = []
        not_found = []
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0
        edamam.api_calls = 0
        edamam.cache_hits = 0

        # STEP 2: Look up each item
        for item in parsed_items:
            food_name = re.sub(r'\(\d+\s*K?cal[^)]*\)', '', item.get("food_name", "")).strip()
            quantity = item.get("quantity", 1) or 1
            unit = item.get("unit")
            item_embedded = extract_calories_from_text(item.get("food_name", "")) or embedded_calories

            if item_embedded:
                # The order text gave calories, e.g. "200g pasta (350 Kcal/100g)"
                calories_per_100g = item_embedded.get("calories_per_100g", 0)
                if unit in ("g", "gram", "grams"):
                    item_calories = (calories_per_100g / 100) * quantity
                else:
                    item_calories = calories_per_100g * quantity  # assume 100 g each
                final_items.append({
                    "food": food_name, "quantity": quantity,
                    "calories": round(item_calories, 1),
                    "protein": 0, "carbs": 0, "fat": 0,
                    "source": "embedded", "matched_as": None,
                    "weight_g": None, "confidence": "high",
                })
                total_calories += item_calories
                continue

            result = edamam.lookup_item(
                quantity,
                item.get("lookup_name") or food_name,
                unit=unit,
                display_name=food_name,
            )
            if not result:
                not_found.append(food_name)
                continue

            print(f"✅ {food_name} -> {result['matched_as']} "
                  f"({result['weight_g']} g, {result['calories']:.0f} kcal, {result['confidence']})")
            final_items.append({
                "food": food_name,
                "quantity": quantity,
                "calories": round(result["calories"], 1),
                "protein": round(result["protein_g"], 1),
                "carbs": round(result["carbs_g"], 1),
                "fat": round(result["fat_g"], 1),
                "source": "api",
                "matched_as": result["matched_as"],
                "weight_g": result["weight_g"],
                "confidence": result["confidence"],
            })
            total_calories += result["calories"]
            total_protein += result["protein_g"]
            total_carbs += result["carbs_g"]
            total_fat += result["fat_g"]

        api_calls["edamam"] = edamam.api_calls
        api_calls["cache_hits"] = edamam.cache_hits

        if not final_items:
            return FoodResponse(
                success=False,
                message="Couldn't find nutrition data for these items",
                data=None,
                api_calls=api_calls
            )

        # STEP 4: Prepare response
        daily_percentage = round((total_calories / DAILY_CALORIE_GOAL) * 100, 1)
        
        response_data = {
            "meal_summary": {
                "total_calories": round(total_calories, 1),
                "total_protein_g": round(total_protein, 1),
                "total_carbs_g": round(total_carbs, 1),
                "total_fat_g": round(total_fat, 1),
                "daily_percentage": daily_percentage,
                "items_analyzed": len(final_items)
            },
            "items": final_items,
            "not_found": not_found,
            "insights": generate_insights(total_calories, total_protein, total_carbs, total_fat, final_items)
        }
        
        return FoodResponse(
            success=True,
            message="Meal analyzed successfully",
            data=response_data,
            api_calls=api_calls
        )
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return FoodResponse(
            success=False,
            message=f"Analysis failed: {str(e)}",
            data=None,
            api_calls=api_calls
        )

def generate_insights(calories, protein, carbs, fat, items):
    """Generate insights based on nutrition data"""
    insights = []
    
    # Calorie insights
    if calories < 500:
        insights.append("💚 Light meal - good for weight management")
    elif calories < 800:
        insights.append("💛 Moderate meal - balanced")
    elif calories < 1200:
        insights.append("🧡 Heavy meal - you might want a lighter next meal")
    else:
        insights.append("❤️ Very heavy meal - consider sharing or saving half for later")
    
    # Protein insights
    if protein > 30:
        insights.append("💪 High in protein - great for muscle maintenance")
    elif protein < 10 and calories > 500:
        insights.append("🥗 Low in protein - consider adding lean protein")
    
    # Carb insights
    if carbs > 100:
        insights.append("🍚 High in carbs - good for energy, but watch portions")
    
    # Fat insights
    if fat > 40:
        insights.append("🥑 High in fat - check if these are healthy fats")
    
    # Variety insights
    if len(items) >= 3:
        insights.append("🍽️ Good variety in your meal")
    
    return insights[:3]  # Return top 3 insights

@app.get("/")
def home():
    return {
        "message": "🍽️ Food Analysis Agent Ready",
        "api_flow": {
            "1": "Gemini parses your description (1 call)",
            "2": "Edamam gets nutrition data (1 call per meal)",
            "3": "Results combined and cached"
        }
    }

# Test function
if __name__ == "__main__":
    import asyncio
    
    async def test():
        print("\n🧪 TESTING CONNECTED AGENT")
        print("="*60)
        
        tests = [
            "2 pizza and 3 coke",
            # "burger and fries",
            # "200g pasta (350 Kcal/100g)"
        ]
        
        for test_desc in tests:
            print(f"\n📝 Testing: {test_desc}")
            request = FoodRequest(description=test_desc)
            response = await analyze_meal(request)
            
            print(f"✅ Success: {response.success}")
            print(f"📊 API Calls: Gemini={response.api_calls['gemini']}, Edamam={response.api_calls['edamam']}, Cache={response.api_calls['cache_hits']}")
            
            if response.data:
                summary = response.data["meal_summary"]
                print(f"🍽️ Total: {summary['total_calories']} kcal ({summary['daily_percentage']}% of daily)")
                print(f"   Protein: {summary['total_protein_g']}g, Carbs: {summary['total_carbs_g']}g, Fat: {summary['total_fat_g']}g")
                print(f"📋 Items: {json.dumps(response.data['items'], indent=2)}")
                print(f"💡 Insights: {response.data['insights']}")
    
    asyncio.run(test())