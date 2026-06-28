import requests
import json

app_id = "53659b8e"
app_key = "c0d44645e92ba7d8c8f3cefe914ddd7d"

# Correct endpoint for Recipe Analysis API
url = "https://api.edamam.com/api/nutrition-details"

# You need to send a POST request with JSON body
recipe_data = {
    "title": "Pizza Slice",
    "ingr": [
        "1 large slice pepperoni pizza"
    ]
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(
    url, 
    params={"app_id": app_id, "app_key": app_key},
    json=recipe_data,
    headers=headers
)

print(f"Status Code: {response.status_code}")
print(response.json())