#!/usr/bin/env python3
import requests
import zipfile
import json
import os
import shutil
from PIL import Image

# URL of the new ZIP file
file_url = 'https://cdn.modrinth.com/data/3BlwZj8w/versions/xUxxCHCO/v4.1.4-joshs-more-foods-resourcepack.zip'

# File names
zip_file_name = 'v4.1.4-joshs-more-foods-resourcepack.zip'
extracted_folder = 'extracted_contents'

# Download the file
response = requests.get(file_url)
with open(zip_file_name, 'wb') as file:
    file.write(response.content)

# Extract the ZIP archive
with zipfile.ZipFile(zip_file_name, 'r') as zip_ref:
    zip_ref.extractall(extracted_folder)

# Check files
translations_file_path = '../../translations.json'  # Relative path to translations.json
if os.path.exists(translations_file_path):
    with open(translations_file_path, 'r') as file:
        translations = json.load(file)

    # Remove non-PNG files and move remaining files to the top-level directory
    for root, dirs, files in os.walk(extracted_folder):
        for file in files:
            file_path = os.path.join(root, file)
            if not file.endswith('.png'):
                os.remove(file_path)
            else:
                img = Image.open(file_path)
                width, height = img.size
                if width != height:
                    os.remove(file_path)
                else:
                    base_name = os.path.splitext(file)[0]
                    translation_key = "item.jmmf." + base_name
                    if translation_key not in translations:
                        os.remove(file_path)
                    else:
                        shutil.move(file_path, os.path.join(extracted_folder, file))

    # Remove empty directories
    for root, dirs, files in os.walk(extracted_folder, topdown=False):
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            if not os.listdir(dir_path):
                os.rmdir(dir_path)
    
    os.remove(zip_file_name)
else:
    print("translations.json file not found.")
