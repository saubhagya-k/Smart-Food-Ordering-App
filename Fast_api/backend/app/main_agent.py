from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from .agents.food_parser import FoodParserAgent
from .tools.edamam_tool import EdamamTool
import json
import re

# Initialize FastAPI
app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
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
        
        needs_api_items = []
        embedded_items = []
        
        for item in parsed_items:
            # Check if this item has embedded calories
            item_text = item.get("food_name", "")
            item_embedded = extract_calories_from_text(item_text)
            
            if item_embedded or embedded_calories:
                item["has_embedded_calories"] = True
                item["embedded_data"] = item_embedded or embedded_calories
                embedded_items.append(item)
            else:
                # Format for Edamam
                qty = int(item.get("quantity", 1))
                food = item.get("food_name", "").strip()
                
                # Clean food name
                food = re.sub(r'\(\d+\s*K?cal[^)]*\)', '', food).strip()
                
                if qty == 1:
                    formatted = f"1 {food}"
                else:
                    formatted = f"{qty} {food}"
                
                needs_api_items.append(formatted)
        
        print(f"📊 Items needing API: {len(needs_api_items)}")
        print(f"📊 Items with embedded calories: {len(embedded_items)}")
        print(f"📊 Formatted for Edamam: {needs_api_items}")
        
        # STEP 2: Get nutrition from Edamam
        nutrition_results = {"items": [], "total": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}
        
        if needs_api_items:
            print(f"\n🔍 STEP 2: Calling Edamam for {len(needs_api_items)} items")
            api_result = edamam.get_meal_nutrition(needs_api_items)
            
            if api_result.get("source") == "cache":
                api_calls["cache_hits"] += 1
            else:
                api_calls["edamam"] = 1
            
            if api_result.get("status_code") == 200:
                nutrition_results = edamam.extract_meal_summary(api_result)
                print(f"✅ Edamam success: {nutrition_results.get('total', {}).get('calories', 0)} calories")
            else:
                print(f"⚠️ Edamam error: {api_result.get('message')}")
                
                # Try common food substitutions
                substitutions = {
                    "burger": "hamburger sandwich",
                    "fries": "potato french fries",
                    "coke": "coca-cola classic",
                    "pizza": "cheese pizza",
                    "cold drink": "soft drink",
                    "soda": "carbonated soft drink"
                    }
                
                simplified_items = []
                for item in needs_api_items:
                    new_item = item
                    for key, value in substitutions.items():
                        if key in item.lower():
                            new_item = item.lower().replace(key, value)
                    simplified_items.append(new_item)
                
                if simplified_items != needs_api_items:
                    print(f"🔄 Trying with substitutions: {simplified_items}")
                    api_result = edamam.get_meal_nutrition(simplified_items)
                    if api_result.get("status_code") == 200:
                        nutrition_results = edamam.extract_meal_summary(api_result)
                        print(f"✅ Substitutions worked!")
        
        # STEP 3: Combine results
        final_items = []
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0
        
        # Process embedded calorie items
        for item in embedded_items:
            food_name = item.get("food_name", "Unknown")
            quantity = item.get("quantity", 1)
            unit = item.get("unit")
            
            if "embedded_data" in item:
                embedded = item["embedded_data"]
                calories_per_100g = embedded.get("calories_per_100g", 0)
                
                if unit == "g" or unit == "gram":
                    item_calories = (calories_per_100g / 100) * quantity
                else:
                    # Assume whole item = 100g equivalent
                    item_calories = calories_per_100g * quantity
            else:
                item_calories = 0
            
            final_items.append({
                "food": food_name,
                "quantity": quantity,
                "calories": round(item_calories, 1),
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "source": "embedded"
            })
            
            total_calories += item_calories
        
        # Process API items
        if nutrition_results and "items" in nutrition_results:
            for api_item in nutrition_results["items"]:
                # Find matching parsed item for quantity
                food_text = api_item.get("text", "").lower()
                quantity = 1
                
                for parsed in parsed_items:
                    parsed_food = parsed.get("food_name", "").lower()
                    if parsed_food in food_text or food_text in parsed_food:
                        quantity = parsed.get("quantity", 1)
                        break
                
                # Extract nutrients with proper extraction
                item_calories = api_item.get("calories", 0)
                item_protein = api_item.get("protein_g", 0)
                item_carbs = api_item.get("carbs_g", 0)
                item_fat = api_item.get("fat_g", 0)


                

                
                
                final_items.append({
                    "food": api_item.get("food", food_text[:20]),
                    "quantity": quantity,
                    "calories": round(item_calories, 1),
                    "protein": round(item_protein, 1),
                    "carbs": round(item_carbs, 1),
                    "fat": round(item_fat, 1),
                    "source": "api"
                })
                
                total_calories += item_calories
                total_protein += item_protein
                total_carbs += item_carbs
                total_fat += item_fat
        
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