import os
import re
import time
from typing import Any, Dict, List, Optional

import requests
from dotenv import load_dotenv

load_dotenv()

# Restaurant / marketing words that don't change what the food is.
FILLER_WORDS = {
    "mixed", "special", "signature", "classic", "loaded", "regular", "large",
    "medium", "small", "premium", "deluxe", "combo", "meal", "style",
    "homestyle", "house", "chef", "chefs", "new", "fresh", "original",
    "the", "with", "and", "of", "in", "a", "an", "serving", "plate", "portion",
}


# Brand / everyday names -> the word Edamam uses
SYNONYMS = {"coke": "cola", "pepsi": "cola", "soda": "cola", "thum": "cola"}


def _words(text: str) -> List[str]:
    """Lowercase keywords, plural 's' removed, filler words dropped."""
    words = re.findall(r"[a-z]+", (text or "").lower())
    words = [w[:-1] if len(w) > 3 and w.endswith("s") else w for w in words]
    words = [SYNONYMS.get(w, w) for w in words]
    return [w for w in words if w not in FILLER_WORDS]


def _coverage(reference: str, matched: str) -> float:
    """Share of the reference's keywords that appear in Edamam's match."""
    ref = set(_words(reference))
    if not ref:
        return 0.0
    return len(ref & set(_words(matched))) / len(ref)


class EdamamTool:
    """
    Looks up nutrition for one food item at a time with Edamam's
    Nutrition Analysis API, and checks that what Edamam matched actually
    fits the dish (it sometimes matches only one word, e.g.
    "Chicken Mixed Sauce Pasta" -> a 23 g spoon of plain pasta).
    """

    def __init__(self, app_id: str = None, app_key: str = None):
        self.app_id = app_id or os.getenv("EDAMAM_APP_ID")
        self.app_key = app_key or os.getenv("EDAMAM_APP_KEY")
        if not self.app_id or not self.app_key:
            raise ValueError("Edamam credentials missing!")

        # Single-item endpoint. (The bulk "nutrition-details" endpoint rejects
        # the whole meal with 555 low_quality if any item is a dish name.)
        self.base_url = "https://api.edamam.com/api/nutrition-data"

        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_expiry = 7 * 24 * 60 * 60  # 7 days
        self.api_calls = 0
        self.cache_hits = 0

    # ---------- low level ----------

    def _query(self, text: str) -> Optional[Dict[str, Any]]:
        """Ask Edamam about one line like '1 serving chicken pasta'.
        Returns the first parsed food, or None if not recognised."""
        key = text.lower().strip()
        cached = self.cache.get(key)
        if cached and time.time() - cached["timestamp"] < self.cache_expiry:
            self.cache_hits += 1
            return cached["parsed"]

        try:
            response = requests.get(
                self.base_url,
                params={
                    "app_id": self.app_id,
                    "app_key": self.app_key,
                    "nutrition-type": "logging",
                    "ingr": text,
                },
                timeout=20,
            )
        except Exception as e:
            print(f"⚠️ Edamam request failed for '{text}': {e}")
            return None

        self.api_calls += 1
        print(f"📡 Edamam '{text}': HTTP {response.status_code}")
        if response.status_code != 200:
            print(f"⚠️ Edamam error: {response.text[:150]}")
            return None

        parsed = None
        for ingredient in response.json().get("ingredients", []):
            if ingredient.get("parsed"):
                parsed = ingredient["parsed"][0]
                break

        self.cache[key] = {"parsed": parsed, "timestamp": time.time()}
        return parsed

    # ---------- public ----------

    def lookup_item(
        self,
        quantity: float,
        name: str,
        unit: Optional[str] = None,
        display_name: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Nutrition for `quantity` x `name`. Without a unit it asks for whole
        servings ("1 serving chicken pasta"), which gives realistic restaurant
        portions. If Edamam's match doesn't fit the dish, it retries with
        simpler names and keeps the best fit.
        """
        display_name = display_name or name
        quantity = quantity or 1

        # Names to try, best first, without duplicates
        simplified = " ".join(_words(display_name))
        keywords = _words(display_name)
        candidates = [name, display_name, simplified]
        if len(keywords) > 2:
            candidates.append(f"{keywords[0]} {keywords[-1]}")  # e.g. "chicken pasta"
        seen, names = set(), []
        for candidate in candidates:
            candidate = (candidate or "").strip()
            if candidate and candidate.lower() not in seen:
                seen.add(candidate.lower())
                names.append(candidate)

        measure = unit.strip() if unit else "serving"
        best = None
        for candidate in names:
            parsed = self._query(f"{quantity:g} {measure} {candidate}")
            if not parsed:
                continue
            matched = parsed.get("food", "")
            # How well the match fits: against what we asked for, or the dish
            score = max(_coverage(candidate, matched), _coverage(display_name, matched))
            weight = parsed.get("weight", 0) or 0
            if not unit and weight / quantity < 40:
                score -= 0.5  # a "serving" under 40 g is not a real portion
            if best is None or score > best["score"]:
                best = {"score": score, "parsed": parsed, "query": candidate}
            if score >= 0.99:
                break

        if not best:
            return None

        parsed = best["parsed"]
        nutrients = parsed.get("nutrients") or {}

        def amount(key: str) -> float:
            return (nutrients.get(key) or {}).get("quantity", 0) or 0

        score = best["score"]
        return {
            "food": display_name,
            "matched_as": parsed.get("food", ""),
            "quantity": quantity,
            "measure": parsed.get("measure", measure),
            "weight_g": round(parsed.get("weight", 0) or 0),
            "calories": amount("ENERC_KCAL"),
            "protein_g": amount("PROCNT"),
            "carbs_g": amount("CHOCDF"),
            "fat_g": amount("FAT"),
            "confidence": "high" if score >= 0.99 else "medium" if score >= 0.5 else "low",
        }
