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
# Called from Node as:
# python generate_room.py input_path output_path style room color lighting
input_path = sys.argv[1]
output_path = sys.argv[2]
style = sys.argv[3]
room = sys.argv[4]
color = sys.argv[5]
lighting = sys.argv[6]

# ================= ROOM-SPECIFIC DECOR MAP =================
ROOM_DECOR_MAP = {
    "Living Room": """
    add sofa set, armchairs, coffee table, rug,
    TV unit or media console, wall art, indoor plants,
    warm ambient lighting, ceiling lights, decor accessories
    """,

    "Bedroom": """
    add bed with headboard, bedside tables, table lamps,
    wardrobe or storage unit, soft bedding and cushions,
    calm ambient lighting, minimal cozy decor,rug
    """,

    "Kitchen": """
    add modular kitchen cabinets, countertop, kitchen appliances,
    built-in appliances, kitchen island or breakfast counter,
    bar stools, under-cabinet lighting, modern kitchen fixtures, refrigerator, oven,plants,furnitures
    """,

    "Bathroom": """
    add vanity unit, mirror, wash basin,
    shower enclosure or bathtub,
    wall-mounted storage, soft white lighting, clean finishes
    """,

    "Office": """
    add work desk, ergonomic chair, shelves or cabinets,
    task lighting, minimal professional decor,
    organized workspace setup
    """
}

decor_prompt = ROOM_DECOR_MAP.get(
    room,
    "add appropriate furniture and decor suitable for the room"
)

# ================= PROMPT =================
prompt = f"""
Modern {room} interior design,
{style} style,
{color} color palette,
{lighting} lighting,

Preserve the exact original room structure from the input image.
DO NOT change walls, windows, doors, ceiling height, floor layout, or room geometry.
Keep wall positions, window sizes, window placement, and architectural structure exactly the same.

{decor_prompt}

Photorealistic, high-quality interior visualization,
professional interior photography style,
cinematic lighting,
no distortion, no zoom, no perspective change
"""

# ================= NEGATIVE PROMPT =================
negative_prompt = (
    "change walls, move walls, add walls, remove walls, "
    "change windows, move windows, add windows, remove windows, "
    "alter room layout, alter geometry, change ceiling height, "
    "change floor plan, structural changes, architectural changes, "
    "zoomed-in view, cropped image, fisheye lens, wide-angle distortion, "
    "unrealistic proportions, fantasy architecture"
)

# ================= API CALL =================
with open(input_path, "rb") as img:
    response = requests.post(
    "https://api.stability.ai/v2beta/stable-image/control/structure",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json"
    },
    files={
        "image": img
    },
    data={
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "control_strength": 0.7,
        "seed": 42,
        "output_format": "png"
    }
)


if response.status_code != 200:
    raise Exception(response.text)

# ================= SAVE OUTPUT =================
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
