
import sys
import os
import base64
import requests
from dotenv import load_dotenv

# ================= LOAD ENV =================
load_dotenv()
API_KEY = os.getenv("STABILITY_API_KEY")

if not API_KEY:
    raise Exception("STABILITY_API_KEY missing")

# ================= ARGUMENTS =================
input_path = sys.argv[1]
output_path = sys.argv[2]
style = sys.argv[3]
room = sys.argv[4]
color = sys.argv[5]
lighting = sys.argv[6]

# ================= PROMPT =================
prompt = f"""
Modern {room} interior design,
{style} style,
{color} color palette,
{lighting} lighting,
preserve original room structure,
add furniture, sofa ,rug, warm lights,ceiling lights, decor only,
realistic professional interior photo
"""

# ================= API CALL =================
with open(input_path, "rb") as img:
    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/control/sketch",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Accept": "application/json"
        },
        files={"image": img},
        data={
            "prompt": prompt,
            "control_strength": 0.8,
            "seed": 42,
            "output_format": "png"
        }
    )

if response.status_code != 200:
    raise Exception(response.text)

result = response.json()
image_base64 = result["image"]
image_bytes = base64.b64decode(image_base64)

# Ensure output directory exists
output_dir = os.path.dirname(output_path)
if output_dir and not os.path.exists(output_dir):
    os.makedirs(output_dir, exist_ok=True)

with open(output_path, "wb") as f:
    f.write(image_bytes)

print("AI image generated successfully")
