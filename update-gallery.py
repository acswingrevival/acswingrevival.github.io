#!/usr/bin/env python3
"""
UPDATE GALLERY
==============
Run this script after adding or removing photos from the images/ folder.

  Mac/Linux:  double-click this file, or run:  python3 update-gallery.py
  Windows:    double-click this file, or run:  python update-gallery.py

That's it. The website will show your new photos automatically.
"""

import os
import json

script_dir  = os.path.dirname(os.path.abspath(__file__))
image_dir   = os.path.join(script_dir, 'images')
extensions  = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

images = sorted(
    f for f in os.listdir(image_dir)
    if os.path.splitext(f)[1].lower() in extensions
)

manifest_path = os.path.join(image_dir, 'manifest.json')
with open(manifest_path, 'w') as f:
    json.dump(images, f, indent=2)
    f.write('\n')

print(f"Done! Gallery updated with {len(images)} photo(s):\n")
for img in images:
    print(f"  {img}")

print("\nUpload your website files to make the changes live.")
input("\nPress Enter to close...")
