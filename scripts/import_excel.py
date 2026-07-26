import pandas as pd
import json
import re
import os

excel_path = r'D:\Desktop\OVIC BOOKSHOP.xlsx'
json_path = r'C:\Users\WASBERRY\.gemini\antigravity\scratch\ovic-shop\src\content\products.json'

def generate_slug(title):
    # Convert to lowercase
    slug = title.lower()
    # Remove special characters and keep alphanumeric and spaces
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'\s+', '-', slug)
    return slug.strip('-')

df = pd.read_excel(excel_path)
products = []

for index, row in df.iterrows():
    title = str(row['Names']).strip()
    image_url = str(row['Images']).strip()
    
    products.append({
        "slug": generate_slug(title),
        "title": title,
        "imageUrl": image_url,
        "categories": ["Uncategorized"]
    })

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Successfully converted {len(products)} products to JSON.")
