#!/usr/bin/env python3
"""
Script to validate skills data structure and content
Checks for common errors and inconsistencies
"""

import json
import os
from typing import List, Dict, Any

class SkillValidator:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.valid_check_types = [
            'Front', 'Pace', 'Late', 'End',
            'Sprint', 'Mile', 'Medium', 'Long',
            'Turf', 'Dirt'
        ]
        self.valid_colors = ['ius', 'golden', 'yellow', 'red', 'green', 'blue', 'purple']
        
    def validate_skill(self, skill: Dict[str, Any], color: str, index: int) -> bool:
        """Validate a single skill"""
        is_valid = True
        skill_id = skill.get('id', f'{color}_{index}')
        
        # Check required fields
        required_fields = ['id', 'name', 'rarity', 'score']
        for field in required_fields:
            if field not in skill:
                self.errors.append(f"❌ {skill_id}: Missing required field '{field}'")
                is_valid = False
        
        # Validate ID format
        if 'id' in skill:
            expected_id = f"{color}_{str(index + 1).zfill(3)}"
            if skill['id'] != expected_id:
                self.warnings.append(f"⚠️  {skill_id}: ID should be '{expected_id}' but is '{skill['id']}'")
        
        # Validate rarity matches file
        if 'rarity' in skill and skill['rarity'] != color:
            self.errors.append(f"❌ {skill_id}: Rarity '{skill['rarity']}' doesn't match file color '{color}'")
            is_valid = False
        
        # Validate check_type
        if 'check_type' in skill and skill['check_type']:
            if skill['check_type'] not in self.valid_check_types:
                self.warnings.append(f"⚠️  {skill_id}: Unknown check_type '{skill['check_type']}'")
        
        # Validate score structure
        if 'score' in skill:
            if isinstance(skill['score'], dict):
                # For non-IUS skills, should have rating-based scores
                if color != 'ius':
                    expected_score_keys = ['base', 'good', 'average', 'bad', 'terrible']
                    missing_keys = [key for key in expected_score_keys if key not in skill['score']]
                    if missing_keys:
                        self.warnings.append(f"⚠️  {skill_id}: Score missing keys: {missing_keys}")
                    
                    # Check for negative scores in non-purple skills
                    if color != 'purple':
                        for key, value in skill['score'].items():
                            if isinstance(value, (int, float)) and value < 0:
                                self.warnings.append(f"⚠️  {skill_id}: Negative score value {key}={value}")
            elif isinstance(skill['score'], (int, float)):
                # IUS skills typically have simple numeric scores
                if color != 'ius':
                    self.warnings.append(f"⚠️  {skill_id}: Non-IUS skill has simple numeric score")
        
        # Check for empty name
        if 'name' in skill and not skill['name'].strip():
            self.errors.append(f"❌ {skill_id}: Empty skill name")
            is_valid = False
        
        return is_valid
    
    def validate_color_file(self, file_path: str, color: str) -> bool:
        """Validate a single color file"""
        print(f"\n🔍 Validating {color}.json...")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                skills = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"❌ {color}.json: Invalid JSON - {str(e)}")
            return False
        except Exception as e:
            self.errors.append(f"❌ {color}.json: Error reading file - {str(e)}")
            return False
        
        if not isinstance(skills, list):
            self.errors.append(f"❌ {color}.json: Root should be an array")
            return False
        
        all_valid = True
        skill_names = set()
        
        for index, skill in enumerate(skills):
            if not self.validate_skill(skill, color, index):
                all_valid = False
            
            # Check for duplicate names
            if 'name' in skill:
                if skill['name'] in skill_names:
                    self.warnings.append(f"⚠️  {color}: Duplicate skill name '{skill['name']}'")
                skill_names.add(skill['name'])
        
        print(f"   ✓ {len(skills)} skills checked")
        return all_valid
    
    def validate_index_file(self, index_path: str) -> bool:
        """Validate the index file"""
        print("\n🔍 Validating skills_index.json...")
        
        try:
            with open(index_path, 'r', encoding='utf-8') as f:
                index_data = json.load(f)
        except Exception as e:
            self.errors.append(f"❌ skills_index.json: Error reading - {str(e)}")
            return False
        
        # Check required fields
        required_fields = ['version', 'colors', 'files']
        for field in required_fields:
            if field not in index_data:
                self.errors.append(f"❌ Index: Missing required field '{field}'")
                return False
        
        # Validate colors list
        if set(index_data['colors']) != set(self.valid_colors):
            missing = set(self.valid_colors) - set(index_data['colors'])
            extra = set(index_data['colors']) - set(self.valid_colors)
            if missing:
                self.warnings.append(f"⚠️  Index: Missing colors: {missing}")
            if extra:
                self.warnings.append(f"⚠️  Index: Extra colors: {extra}")
        
        print(f"   ✓ Index file valid")
        return True
    
    def print_report(self):
        """Print validation report"""
        print("\n" + "=" * 60)
        print("VALIDATION REPORT")
        print("=" * 60)
        
        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"   {error}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"   {warning}")
        
        if not self.errors and not self.warnings:
            print("\n✅ All validations passed! No errors or warnings.")
        elif not self.errors:
            print("\n✅ No critical errors found, but there are warnings to review.")
        else:
            print(f"\n❌ Validation failed with {len(self.errors)} error(s).")
        
        print("=" * 60)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    skills_dir = os.path.join(script_dir, "skills")
    index_file = os.path.join(script_dir, "skills_index.json")
    
    print("=" * 60)
    print("Skills Data Validator")
    print("=" * 60)
    
    validator = SkillValidator()
    
    # Validate index file
    validator.validate_index_file(index_file)
    
    # Validate each color file
    colors = ['ius', 'golden', 'yellow', 'red', 'green', 'blue', 'purple']
    for color in colors:
        file_path = os.path.join(skills_dir, f"{color}.json")
        if os.path.exists(file_path):
            validator.validate_color_file(file_path, color)
        else:
            validator.errors.append(f"❌ Missing file: {color}.json")
    
    # Print report
    validator.print_report()
    
    # Return exit code
    return 0 if not validator.errors else 1

if __name__ == "__main__":
    exit(main())
