from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
import json
import re
import time
import hashlib
from typing import Dict, Any, Optional, List
import os

os.environ["GOOGLE_API_KEY"] = "AIzaSyA3lBgidspcGyooVK0UAws_BwBB8uZdDpQ"

class FoodParserAgent:
    """
    AI Agent - ONE Gemini call per description (handles multiple items)
    """
    
    def __init__(self):
        print("🤖 Initializing Food Parser Agent...")
        
        # SINGLE model - no switching
        self.model = "models/gemini-2.5-flash-lite"
        self.llm = ChatGoogleGenerativeAI(
            model=self.model,
            temperature=0.1,
            convert_system_message_to_human=True
        )
        
        self.cache = {}
        self.last_call_time = 0
        self.min_call_interval = 2
    
    def _rate_limit(self):
        current_time = time.time()
        time_since_last = current_time - self.last_call_time
        if time_since_last < self.min_call_interval:
            time.sleep(self.min_call_interval - time_since_last)
        self.last_call_time = time.time()
    
    def parse_description(self, description: str) -> List[Dict[str, Any]]:
        """
        ONE Gemini call returns LIST of all food items
        """
        print(f"📝 Gemini parsing: {description}")
        
        # Check cache
        cache_key = hashlib.md5(description.encode()).hexdigest()
        if cache_key in self.cache:
            print("✅ Using cached Gemini result")
            return self.cache[cache_key]
        
        self._rate_limit()
        
        system_prompt = """You are a food parser. Return a JSON array of food items.

Format:
[
  {
    "food_name": "item name",
    "quantity": number,
    "unit": "unit or null",
    "needs_api": true/false
  }
]

Rules:
- Extract quantity and food name from descriptions like "2 pizza", "3 coke", "1 cake"
- If description has embedded calories like "292 Kcal/100g", set needs_api=false
- Otherwise set needs_api=true
- Handle multiple items separated by "and" or commas
"""
        
        user_prompt = f"Parse this: {description}"
        
        try:
            # ONE API call for entire description
            response = self.llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt)
            ])
            
            # Extract JSON array
            items = self._extract_json_array(response.content)
            
            # Ensure all items have required fields
            for item in items:
                item.setdefault("quantity", 1)
                item.setdefault("unit", None)
                item.setdefault("needs_api", True)
            
            # Cache result
            self.cache[cache_key] = items
            print(f"✅ Gemini returned {len(items)} item(s)")
            return items
            
        except Exception as e:
            print(f"❌ Gemini error: {e}")
            return self._fallback_parse(description)
    
    def _fallback_parse(self, description: str) -> List[Dict[str, Any]]:
        """Fallback when Gemini fails"""
        items = []
        
        # Simple split by "and" or commas
        parts = re.split(r'\s+(?:and|,)\s+|\s*,\s*', description)
        
        for part in parts:
            if not part.strip():
                continue
            
            # Extract quantity
            quantity = 1
            match = re.search(r'^(\d+)', part)
            if match:
                quantity = float(match.group(1))
                food_name = re.sub(r'^\d+\s*', '', part)
            else:
                food_name = part
            
            items.append({
                "food_name": food_name.strip(),
                "quantity": quantity,
                "unit": None,
                "needs_api": True
            })
        
        return items
    
    def _extract_json_array(self, text: str) -> List[Dict]:
        """Extract JSON array from response"""
        try:
            start = text.find('[')
            end = text.rfind(']') + 1
            if start != -1 and end != 0:
                return json.loads(text[start:end])
            return []
        except:
            return []

# # Quick test
# if __name__ == "__main__":
#     parser = FoodParserAgent()
    
#     test_descriptions = [
#         "2 pizza and 3 coke and 1 cake",
#         "burger and fries",
#         "I ate 200g of pizza (292 Kcal/100g)"
#     ]
    
#     for desc in test_descriptions:
#         print("\n" + "="*50)
#         items = parser.parse_description(desc)
#         print(f"Items: {json.dumps(items, indent=2)}")