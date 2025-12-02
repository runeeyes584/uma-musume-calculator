#!/usr/bin/env python3
"""
Script to import/update skills from TSV file
TSV Format: name, base, good, average, bad, terrible, check_type
"""

import json
import os
import csv
from datetime import datetime
from typing import Dict, List, Any

def read_tsv(tsv_file: str) -> List[Dict[str, Any]]:
    """Read TSV file and return list of skill data"""
    skills = []
    
    with open(tsv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        
        # Expected columns
        expected_columns = ['name', 'base', 'good', 'average', 'bad', 'terrible', 'check_type']
        
        for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is line 1)
            try:
                skill = {
                    'name': row['name'].strip(),
                    'base': int(row['base']) if row['base'].strip() else None,
                    'good': int(row['good']) if row['good'].strip() else None,
                    'average': int(row['average']) if row['average'].strip() else None,
                    'bad': int(row['bad']) if row['bad'].strip() else None,
                    'terrible': int(row['terrible']) if row['terrible'].strip() else None,
                    'check_type': row['check_type'].strip() if row['check_type'].strip() else None
                }
                skills.append(skill)
            except (KeyError, ValueError) as e:
                print(f"⚠️  Warning: Error at line {row_num}: {e}")
                continue
    
    return skills

def create_score_object(skill_data: Dict[str, Any]) -> Any:
    """Create score object from TSV data"""
    # If all values are the same or only base is set, use simple format
    base = skill_data['base']
    good = skill_data['good']
    average = skill_data['average']
    bad = skill_data['bad']
    terrible = skill_data['terrible']
    
    # Simple numeric score (e.g., IUS skills)
    if all(v is None for v in [good, average, bad, terrible]) and base is not None:
        return base
    
    # Full score object
    score = {}
    if base is not None:
        score['base'] = base
    if good is not None:
        score['good'] = good
    if average is not None:
        score['average'] = average
    if bad is not None:
        score['bad'] = bad
    if terrible is not None:
        score['terrible'] = terrible
    
    return score if score else 0

def update_skills_from_tsv(tsv_file: str, color: str, json_file: str, mode: str = 'update'):
    """
    Update skills from TSV file
    
    Args:
        tsv_file: Path to TSV file
        color: Color of skills (ius, golden, yellow, etc.)
        json_file: Path to JSON file to update
        mode: 'update' (update existing) or 'replace' (replace all) or 'add' (add new only)
    """
    
    print(f"\n{'='*60}")
    print(f"Importing skills from TSV: {os.path.basename(tsv_file)}")
    print(f"Target: {color}.json")
    print(f"Mode: {mode}")
    print(f"{'='*60}\n")
    
    # Read TSV data
    print("📖 Reading TSV file...")
    tsv_skills = read_tsv(tsv_file)
    print(f"   ✓ Found {len(tsv_skills)} skills in TSV\n")
    
    # Read existing JSON
    existing_skills = []
    next_id = 1
    
    if os.path.exists(json_file) and mode != 'replace':
        print("📖 Reading existing JSON file...")
        with open(json_file, 'r', encoding='utf-8') as f:
            existing_skills = json.load(f)
        print(f"   ✓ Found {len(existing_skills)} existing skills\n")
        
        # Find next available ID
        if existing_skills:
            last_id = max(int(s['id'].split('_')[1]) for s in existing_skills if 'id' in s)
            next_id = last_id + 1
    
    # Create name-to-skill mapping for existing skills
    existing_by_name = {s['name']: s for s in existing_skills if 'name' in s}
    
    # Process TSV skills
    updated_count = 0
    added_count = 0
    skipped_count = 0
    
    updated_skills = []
    today = datetime.now().strftime("%Y-%m-%d")
    
    if mode == 'replace':
        # Replace mode: create all new from TSV
        print("🔄 Replace mode: Creating new skill list from TSV...\n")
        for idx, tsv_skill in enumerate(tsv_skills):
            skill_id = f"{color}_{str(idx + 1).zfill(3)}"
            
            new_skill = {
                'id': skill_id,
                'name': tsv_skill['name'],
                'rarity': color,
                'updated': today
            }
            
            if tsv_skill['check_type']:
                new_skill['check_type'] = tsv_skill['check_type']
            
            new_skill['score'] = create_score_object(tsv_skill)
            new_skill['description'] = ''
            
            updated_skills.append(new_skill)
            added_count += 1
        
    else:
        # Update or Add mode
        print(f"🔄 Processing skills...\n")
        
        # Start with existing skills
        for existing_skill in existing_skills:
            skill_name = existing_skill['name']
            
            if skill_name in [tsv['name'] for tsv in tsv_skills]:
                # Found in TSV - update it
                tsv_skill = next(s for s in tsv_skills if s['name'] == skill_name)
                
                updated_skill = existing_skill.copy()
                updated_skill['updated'] = today
                
                # Update check_type if provided
                if tsv_skill['check_type']:
                    updated_skill['check_type'] = tsv_skill['check_type']
                elif 'check_type' not in updated_skill:
                    updated_skill['check_type'] = ''
                
                # Update score
                updated_skill['score'] = create_score_object(tsv_skill)
                
                updated_skills.append(updated_skill)
                updated_count += 1
                print(f"   ✓ Updated: {skill_name}")
                
            else:
                # Not in TSV - keep existing
                if mode == 'update':
                    updated_skills.append(existing_skill)
                    skipped_count += 1
        
        # Add new skills from TSV that don't exist
        if mode in ['update', 'add']:
            for tsv_skill in tsv_skills:
                if tsv_skill['name'] not in existing_by_name:
                    skill_id = f"{color}_{str(next_id).zfill(3)}"
                    next_id += 1
                    
                    new_skill = {
                        'id': skill_id,
                        'name': tsv_skill['name'],
                        'rarity': color,
                        'updated': today
                    }
                    
                    if tsv_skill['check_type']:
                        new_skill['check_type'] = tsv_skill['check_type']
                    
                    new_skill['score'] = create_score_object(tsv_skill)
                    new_skill['description'] = ''
                    
                    updated_skills.append(new_skill)
                    added_count += 1
                    print(f"   + Added: {tsv_skill['name']}")
    
    # Write updated JSON
    print(f"\n💾 Writing to {json_file}...")
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(updated_skills, f, indent=2, ensure_ascii=False)
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    print(f"📊 Total skills in file: {len(updated_skills)}")
    print(f"✓ Updated: {updated_count}")
    print(f"+ Added: {added_count}")
    if skipped_count > 0:
        print(f"⊘ Kept unchanged: {skipped_count}")
    print(f"{'='*60}\n")
    
    print("✅ Import completed successfully!")
    print("\n💡 Next steps:")
    print(f"   1. Review {json_file}")
    print(f"   2. Run: python validate_skills.py")
    print(f"   3. Test in web browser")

def export_to_tsv(json_file: str, tsv_file: str, color: str):
    """Export JSON skills to TSV format"""
    
    print(f"\n{'='*60}")
    print(f"Exporting {color}.json to TSV")
    print(f"{'='*60}\n")
    
    # Read JSON
    print("📖 Reading JSON file...")
    with open(json_file, 'r', encoding='utf-8') as f:
        skills = json.load(f)
    print(f"   ✓ Found {len(skills)} skills\n")
    
    # Write TSV
    print(f"💾 Writing to {tsv_file}...")
    with open(tsv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter='\t')
        
        # Write header
        writer.writerow(['name', 'base', 'good', 'average', 'bad', 'terrible', 'check_type'])
        
        # Write skills
        for skill in skills:
            name = skill['name']
            check_type = skill.get('check_type', '')
            
            score = skill['score']
            
            # Handle different score formats
            if isinstance(score, (int, float)):
                base = score
                good = ''
                average = ''
                bad = ''
                terrible = ''
            elif isinstance(score, dict):
                base = score.get('base', '')
                good = score.get('good', '')
                average = score.get('average', '')
                bad = score.get('bad', '')
                terrible = score.get('terrible', '')
            else:
                base = good = average = bad = terrible = ''
            
            writer.writerow([name, base, good, average, bad, terrible, check_type])
    
    print(f"✅ Exported {len(skills)} skills to TSV\n")
    print("💡 You can now edit the TSV file in Excel or any text editor")
    print("   Then import back using: python import_from_tsv.py import {tsv_file} {color}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Import: python import_from_tsv.py import <tsv_file> <color> [mode]")
        print("  Export: python import_from_tsv.py export <color>")
        print()
        print("Examples:")
        print("  python import_from_tsv.py import golden_skills.tsv golden")
        print("  python import_from_tsv.py import golden_skills.tsv golden update")
        print("  python import_from_tsv.py import golden_skills.tsv golden replace")
        print("  python import_from_tsv.py export golden")
        print()
        print("Modes:")
        print("  update  - Update existing skills and add new ones (default)")
        print("  replace - Replace all skills with TSV data")
        print("  add     - Only add new skills, don't update existing")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    if command == 'import':
        if len(sys.argv) < 4:
            print("Error: Import requires <tsv_file> and <color>")
            sys.exit(1)
        
        tsv_file = sys.argv[2]
        color = sys.argv[3].lower()
        mode = sys.argv[4].lower() if len(sys.argv) > 4 else 'update'
        
        # Validate color
        valid_colors = ['ius', 'golden', 'yellow', 'red', 'green', 'blue', 'purple']
        if color not in valid_colors:
            print(f"Error: Invalid color '{color}'. Must be one of: {', '.join(valid_colors)}")
            sys.exit(1)
        
        # Validate mode
        if mode not in ['update', 'replace', 'add']:
            print(f"Error: Invalid mode '{mode}'. Must be: update, replace, or add")
            sys.exit(1)
        
        # Resolve paths
        if not os.path.isabs(tsv_file):
            tsv_file = os.path.join(script_dir, tsv_file)
        
        json_file = os.path.join(script_dir, 'skills', f'{color}.json')
        
        if not os.path.exists(tsv_file):
            print(f"Error: TSV file not found: {tsv_file}")
            sys.exit(1)
        
        update_skills_from_tsv(tsv_file, color, json_file, mode)
    
    elif command == 'export':
        if len(sys.argv) < 3:
            print("Error: Export requires <color>")
            sys.exit(1)
        
        color = sys.argv[2].lower()
        
        # Validate color
        valid_colors = ['ius', 'golden', 'yellow', 'red', 'green', 'blue', 'purple']
        if color not in valid_colors:
            print(f"Error: Invalid color '{color}'. Must be one of: {', '.join(valid_colors)}")
            sys.exit(1)
        
        json_file = os.path.join(script_dir, 'skills', f'{color}.json')
        tsv_file = os.path.join(script_dir, f'{color}_skills.tsv')
        
        if not os.path.exists(json_file):
            print(f"Error: JSON file not found: {json_file}")
            sys.exit(1)
        
        export_to_tsv(json_file, tsv_file, color)
    
    else:
        print(f"Error: Unknown command '{command}'. Use 'import' or 'export'")
        sys.exit(1)
