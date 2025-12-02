#!/usr/bin/env python3
"""
Script to split skills_lib.json into separate files by color
and add metadata to each skill
"""

import json
import os
from datetime import datetime

def add_metadata_to_skill(skill, color, index):
    """Add metadata to a skill entry"""
    # Generate ID
    skill_id = f"{color}_{str(index + 1).zfill(3)}"
    
    # Add metadata
    enhanced_skill = {
        "id": skill_id,
        "name": skill["name"],
        "rarity": color,
        "updated": datetime.now().strftime("%Y-%m-%d")
    }
    
    # Add check-type if exists
    if "check-type" in skill:
        enhanced_skill["check_type"] = skill["check-type"]
    
    # Add score
    enhanced_skill["score"] = skill["score"]
    
    # Add optional description field (empty by default)
    enhanced_skill["description"] = ""
    
    return enhanced_skill

def split_skills_file(input_file, output_dir):
    """Split skills_lib.json into separate color files"""
    
    # Read the original file
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process each color
    colors = ["ius", "golden", "yellow", "blue", "green", "red", "purple"]
    
    for color in colors:
        if color not in data:
            print(f"⚠️  Color '{color}' not found in data")
            continue
        
        # Add metadata to each skill
        enhanced_skills = []
        for index, skill in enumerate(data[color]):
            enhanced_skill = add_metadata_to_skill(skill, color, index)
            enhanced_skills.append(enhanced_skill)
        
        # Write to separate file
        output_file = os.path.join(output_dir, f"{color}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(enhanced_skills, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Created {output_file} with {len(enhanced_skills)} skills")
    
    # Create index file
    index_data = {
        "version": "2.0",
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "colors": colors,
        "description": "Uma Musume Skills Library - Split by color for easier management",
        "files": {
            color: f"skills/{color}.json" 
            for color in colors
        }
    }
    
    index_file = os.path.join(os.path.dirname(output_dir), "skills_index.json")
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Created index file: {index_file}")
    print("\n✅ Done! Skills have been split into separate files.")
    print(f"📁 Location: {output_dir}")
    print("\n💡 Next steps:")
    print("   1. Review the generated files")
    print("   2. Update skillSystem.js to load from new structure")
    print("   3. Backup original skills_lib.json")

if __name__ == "__main__":
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define paths
    input_file = os.path.join(script_dir, "skills_lib.json")
    output_dir = os.path.join(script_dir, "skills")
    
    # Run the split
    split_skills_file(input_file, output_dir)
