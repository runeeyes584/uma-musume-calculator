#!/usr/bin/env python3
"""
Script to merge individual skill files back into skills_lib.json
Use this when you want to create a single file from modular structure
"""

import json
import os
from datetime import datetime

def merge_skills_files(skills_dir, output_file):
    """Merge individual color files into single skills_lib.json"""
    
    # Read index file to get colors and file paths
    index_file = os.path.join(os.path.dirname(skills_dir), "skills_index.json")
    
    if not os.path.exists(index_file):
        print(f"❌ Error: {index_file} not found!")
        return False
    
    with open(index_file, 'r', encoding='utf-8') as f:
        index_data = json.load(f)
    
    print(f"📖 Reading skills from version {index_data['version']}")
    
    # Merged data structure
    merged_data = {}
    
    # Process each color
    for color in index_data['colors']:
        # Handle both old format (string) and new format (dict with 'file' key)
        file_info = index_data['files'][color]
        if isinstance(file_info, dict):
            file_path = os.path.join(os.path.dirname(skills_dir), file_info['file'])
        else:
            file_path = os.path.join(os.path.dirname(skills_dir), file_info)
        
        if not os.path.exists(file_path):
            print(f"⚠️  Warning: {file_path} not found, skipping {color}")
            continue
        
        # Read color file
        with open(file_path, 'r', encoding='utf-8') as f:
            skills = json.load(f)
        
        # Convert back to original format (remove metadata for backward compatibility)
        original_format_skills = []
        for skill in skills:
            original_skill = {
                "name": skill["name"]
            }
            
            # Add check-type if exists (use original hyphenated format)
            if "check_type" in skill and skill["check_type"]:
                original_skill["check-type"] = skill["check_type"]
            
            # Add score
            original_skill["score"] = skill["score"]
            
            original_format_skills.append(original_skill)
        
        merged_data[color] = original_format_skills
        print(f"✓ Merged {len(original_format_skills)} {color} skills")
    
    # Write merged file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, indent=4, ensure_ascii=False)
    
    print(f"\n✅ Successfully merged into: {output_file}")
    print(f"📊 Total colors: {len(merged_data)}")
    
    total_skills = sum(len(skills) for skills in merged_data.values())
    print(f"📊 Total skills: {total_skills}")
    
    return True

def create_backup(original_file):
    """Create backup of original file"""
    if not os.path.exists(original_file):
        return None
    
    backup_file = original_file + '.backup.' + datetime.now().strftime("%Y%m%d_%H%M%S")
    
    with open(original_file, 'r', encoding='utf-8') as f_in:
        with open(backup_file, 'w', encoding='utf-8') as f_out:
            f_out.write(f_in.read())
    
    print(f"💾 Backup created: {backup_file}")
    return backup_file

if __name__ == "__main__":
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define paths
    skills_dir = os.path.join(script_dir, "skills")
    output_file = os.path.join(script_dir, "skills_lib.json")
    
    print("=" * 60)
    print("Merge Skills Files → skills_lib.json")
    print("=" * 60)
    print()
    
    # Create backup of existing skills_lib.json
    if os.path.exists(output_file):
        print("📂 Existing skills_lib.json found")
        backup = create_backup(output_file)
        if backup:
            print()
    
    # Merge files
    success = merge_skills_files(skills_dir, output_file)
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Merge completed successfully!")
        print("=" * 60)
        print("\n💡 Note: The merged file uses original format (check-type)")
        print("   The modular files use new format (check_type)")
        print("   Both formats are supported by the system.")
    else:
        print("\n" + "=" * 60)
        print("❌ Merge failed!")
        print("=" * 60)
