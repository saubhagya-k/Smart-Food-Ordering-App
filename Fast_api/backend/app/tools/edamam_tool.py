import requests
import json
import hashlib
import time
from typing import Dict, Any, Optional, List
import os
from dotenv import load_dotenv
load_dotenv() 

class EdamamTool:
    """
    Edamam Tool that handles MULTIPLE ingredients in ONE API call
    """
    
    def __init__(self, app_id: str = None, app_key: str = None):
        self.app_id = app_id or os.getenv("EDAMAM_APP_ID")
        self.app_key = app_key or os.getenv("EDAMAM_APP_KEY")
        if not self.app_id or not self.app_key:
            raise ValueError("Edamam credentials missing!")

        # Edamam Nutrition Analysis API, one item per request. (The bulk
        # "nutrition-details" endpoint rejects the whole meal with
        # 555 low_quality if any item is a dish name like "Red Velvet Cake".)
        self.base_url = "https://api.edamam.com/api/nutrition-data"
        
        # Cache storage
        self.cache = {}
        self.cache_expiry = 7 * 24 * 60 * 60  # 7 days
    
    def _generate_cache_key(self, ingredients: List[str]) -> str:
        """Generate cache key from ingredients list"""
        sorted_ingredients = sorted(ingredients)
        combined = "|".join(sorted_ingredients)
        return hashlib.md5(combined.encode()).hexdigest()
    
    def _check_cache(self, cache_key: str) -> Optional[Dict]:
        """Check for valid cached response"""
        if cache_key in self.cache:
            cached = self.cache[cache_key]
            if time.time() - cached["timestamp"] < self.cache_expiry:
                print(f"✅ Edamam Cache hit for key: {cache_key[:8]}...")
                return cached
            else:
                del self.cache[cache_key]
        return None
    
    def _store_in_cache(self, cache_key: str, etag: str, data: Dict):
        """Store response in cache"""
        self.cache[cache_key] = {
            "etag": etag,
            "data": data,
            "timestamp": time.time()
        }
        print(f"💾 Edamam Cached result for key: {cache_key[:8]}...")
    
    def get_meal_nutrition(self, ingredients: List[str]) -> Dict[str, Any]:
        """
        Nutrition for several items, e.g. ["2 burger", "1 fries", "3 coke"].
        Items Edamam can't recognise are skipped and listed under "skipped".
        """
        print(f"🍽️ Edamam Tool: looking up {len(ingredients)} items")
        for i, ing in enumerate(ingredients):
            print(f"   {i+1}. {ing}")
        
        # Check cache first
        cache_key = self._generate_cache_key(ingredients)
        cached = self._check_cache(cache_key)
        if cached:
            return {
                "source": "cache",
                "data": cached["data"],
                "cache_key": cache_key,
                "status_code": 200
            }
        
        # One request per item, so a dish Edamam can't read only skips
        # that item instead of failing the whole meal.
        combined_ingredients = []
        total_nutrients: Dict[str, Dict[str, Any]] = {}
        failed = []

        for ingredient in ingredients:
            try:
                response = requests.get(
                    self.base_url,
                    params={
                        "app_id": self.app_id,
                        "app_key": self.app_key,
                        "nutrition-type": "logging",
                        "ingr": ingredient,
                    },
                    timeout=20,
                )
            except Exception as e:
                failed.append(f"{ingredient}: {e}")
                continue

            print(f"📡 Edamam API Status for '{ingredient}': {response.status_code}")
            if response.status_code != 200:
                failed.append(f"{ingredient}: {response.status_code} {response.text[:100]}")
                continue

            for item in response.json().get("ingredients", []):
                parsed_items = item.get("parsed") or []
                if not parsed_items:
                    failed.append(f"{ingredient}: not recognised")
                    continue
                combined_ingredients.append({"text": ingredient, "parsed": parsed_items})
                for parsed in parsed_items:
                    for key, nutrient in (parsed.get("nutrients") or {}).items():
                        total = total_nutrients.setdefault(
                            key, {"label": nutrient.get("label", key), "quantity": 0, "unit": nutrient.get("unit", "")}
                        )
                        total["quantity"] += nutrient.get("quantity", 0) or 0

        if failed:
            print(f"⚠️ Edamam skipped: {failed}")

        if not combined_ingredients:
            return {
                "source": "error",
                "error": True,
                "status_code": 422,
                "message": "Edamam could not recognise any item: " + "; ".join(failed)[:300],
            }

        result = {
            "ingredients": combined_ingredients,
            "totalNutrients": total_nutrients,
            "totalDaily": {},
            "skipped": failed,
        }
        self._store_in_cache(cache_key, "", result)
        return {
            "source": "api",
            "data": result,
            "cache_key": cache_key,
            "status_code": 200,
        }

    def extract_meal_summary(self, api_response: Dict[str, Any]) -> Dict[str, Any]:
        """Extract nutrition summary for the entire meal"""
        if api_response.get("error"):
            return {"error": api_response.get("message")}
        
        data = api_response.get("data", {})
        if not data:
            return {"error": "No data"}
        
        # Get total nutrients for the whole meal
        total_nutrients = data.get("totalNutrients", {})
        total_daily = data.get("totalDaily", {})
        
        # Helper function to safely get nutrient quantity
        def get_nutrient(nutrients, key):
            if key in nutrients:
                return nutrients[key].get("quantity", 0)
            return 0
        
        # Meal totals (sum of ALL items)
        meal_summary = {
            "total": {
                "calories": get_nutrient(total_nutrients, "ENERC_KCAL"),
                "protein_g": get_nutrient(total_nutrients, "PROCNT"),
                "carbs_g": get_nutrient(total_nutrients, "CHOCDF"),
                "fat_g": get_nutrient(total_nutrients, "FAT"),
                "fiber_g": get_nutrient(total_nutrients, "FIBTG"),
                "sugar_g": get_nutrient(total_nutrients, "SUGAR"),
            },
            "daily_percentages": {
                "calories": get_nutrient(total_daily, "ENERC_KCAL"),
                "protein": get_nutrient(total_daily, "PROCNT"),
                "carbs": get_nutrient(total_daily, "CHOCDF"),
                "fat": get_nutrient(total_daily, "FAT"),
                "fiber": get_nutrient(total_daily, "FIBTG"),
            }
        }
        
        # Per-item breakdown (individual items)
        ingredients = data.get("ingredients", [])
        per_item = []
        
        for ingredient in ingredients:
            parsed_items = ingredient.get("parsed", [])
            for parsed in parsed_items:
                nutrients = parsed.get("nutrients", {})
                
                per_item.append({
                    "text": ingredient.get("text", ""),
                    "food": parsed.get("food", ""),
                    "quantity": parsed.get("quantity", 0),
                    "measure": parsed.get("measure", ""),
                    "weight_g": parsed.get("weight", 0),
                    "calories": get_nutrient(nutrients, "ENERC_KCAL"),
                    "protein_g": get_nutrient(nutrients, "PROCNT"),
                    "carbs_g": get_nutrient(nutrients, "CHOCDF"),
                    "fat_g": get_nutrient(nutrients, "FAT"),
                })
        
        meal_summary["items"] = per_item
        meal_summary["source"] = api_response.get("source", "api")
        
        return meal_summary