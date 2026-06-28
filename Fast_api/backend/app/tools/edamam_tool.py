import requests
import json
import hashlib
import time
from typing import Dict, Any, Optional, List

class EdamamTool:
    """
    Edamam Tool that handles MULTIPLE ingredients in ONE API call
    """
    
    def __init__(self):
        # Your working credentials
        self.app_id = "53659b8e"
        self.app_key = "c0d44645e92ba7d8c8f3cefe914ddd7d"
        self.base_url = "https://api.edamam.com/api/nutrition-details"
        
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
        ONE API call for MULTIPLE ingredients
        Example: ["2 burger", "1 fries", "3 coke"]
        """
        print(f"🍽️ Edamam Tool: ONE API call for {len(ingredients)} items")
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
        
        # Prepare request
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key
        }
        
        data = {
            "title": "Meal Analysis",
            "ingr": ingredients  # Send ALL ingredients at once
        }
        
        headers = {"Content-Type": "application/json"}
        
        try:
            # ONE API call for ALL ingredients
            response = requests.post(
                self.base_url,
                params=params,
                json=data,
                headers=headers
            )
            
            print(f"📡 Edamam API Status: {response.status_code}")
            
            if response.status_code == 200:
                etag = response.headers.get('ETag', '')
                result = response.json()
                self._store_in_cache(cache_key, etag, result)
                
                return {
                    "source": "api",
                    "data": result,
                    "cache_key": cache_key,
                    "status_code": 200
                }
            else:
                return {
                    "source": "error",
                    "error": True,
                    "status_code": response.status_code,
                    "message": response.text[:200]
                }
                
        except Exception as e:
            return {
                "source": "error",
                "error": True,
                "message": str(e)
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