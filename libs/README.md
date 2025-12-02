# Skills Library - Uma Musume Calculator

## 📁 Directory Structure

```
libs/
├── skills/                      # Individual skill files by color
│   ├── ius.json                # 57 Inherited/Unique Skills (IUS)
│   ├── golden.json             # 114 Golden skills
│   ├── yellow.json             # 106 Yellow skills
│   ├── red.json                # 30 Red skills (debuffs)
│   ├── green.json              # 74 Green skills (aptitudes)
│   ├── blue.json               # 26 Blue skills
│   └── purple.json             # 32 Purple skills (negative)
│
├── tsv/                        # TSV files for Excel editing
│   ├── ius_skills.tsv
│   ├── golden_skills.tsv
│   ├── yellow_skills.tsv
│   ├── red_skills.tsv
│   ├── green_skills.tsv
│   ├── blue_skills.tsv
│   └── purple_skills.tsv
│
├── skills_lib.json             # Master file (all skills merged)
├── skills_index.json           # Metadata index
│
├── split_skills.py             # Split master → color files
├── merge_skills.py             # Merge color files → master
├── validate_skills.py          # Validate data integrity
├── import_from_tsv.py          # TSV ↔ JSON conversion
├── tsv.bat                     # Windows batch helper
│
├── TSV_QUICK_START.md          # Quick start guide
├── TSV_IMPORT_GUIDE.md         # Detailed TSV workflow
└── skills_lib.json.backup.*    # Auto-generated backups
```

## 🎯 Quick Reference

### View Current Database
```bash
# Total skills count
python -c "import json; print(sum([len(json.load(open(f'skills/{c}.json'))) for c in ['ius','golden','yellow','red','green','blue','purple']]))"
```

### Edit Skills (TSV Workflow)
```cmd
# 1. Export to Excel-friendly format
tsv.bat export golden

# 2. Edit tsv\golden_skills.tsv in Excel

# 3. Import changes back
tsv.bat import golden_skills.tsv golden update

# 4. Validate (should show 0 errors)
python validate_skills.py
```

### Python Tools
```bash
# Export color to TSV
python import_from_tsv.py export <color>

# Import TSV (modes: update/replace/add)
python import_from_tsv.py import <file>.tsv <color> <mode>

# Merge all colors → master file
python merge_skills.py

# Split master → color files
python split_skills.py

# Validate integrity
python validate_skills.py
```

## 📊 Database Statistics

**Current Version**: 2.0  
**Last Updated**: 2025-12-02  
**Total Skills**: 439

| Color  | Count | Description |
|--------|-------|-------------|
| IUS    | 57    | Inherited/Unique Skills (all base=180) |
| Golden | 114   | Premium skills |
| Yellow | 106   | Standard skills |
| Red    | 30    | Debuff skills |
| Green  | 74    | Aptitude skills |
| Blue   | 26    | Stamina skills |
| Purple | 32    | Negative skills |

## 🔄 Workflow

### Adding New Skills
1. Export: `tsv.bat export <color>`
2. Add rows in Excel: `tsv\<color>_skills.tsv`
3. Import: `tsv.bat import <color>_skills.tsv <color> add`
4. Validate: `python validate_skills.py`

### Updating Existing Skills
1. Export: `tsv.bat export <color>`
2. Edit values in Excel
3. Import: `tsv.bat import <color>_skills.tsv <color> update`
4. Validate: `python validate_skills.py`

### Mass Changes
1. Export all: `tsv.bat exportall`
2. Edit multiple TSV files
3. Import each: `tsv.bat import <file>.tsv <color> update`
4. Validate: `python validate_skills.py`

## 📝 TSV Format

Required columns:
- `name`: Skill name (unique)
- `base`: Base score value
- `good`: Good condition score (optional)
- `average`: Average condition score (optional)
- `bad`: Bad condition score (optional)
- `terrible`: Terrible condition score (optional)
- `check_type`: Condition type (Front/Pace/Late/End/Sprint/Mile/Medium/Long/Dirt)

## ⚠️ Important Notes

1. **Always validate** after making changes
2. **Backups** are auto-created when merging
3. **IUS skills** always have base=180
4. **Red/Purple skills** have negative values
5. **TSV encoding** must be UTF-8

## 🔗 Related Documentation

- `../../docs/SKILLS_README.md` - Complete system overview
- `TSV_QUICK_START.md` - Quick start guide
- `TSV_IMPORT_GUIDE.md` - Detailed workflow
- `../../docs/QUICK_REFERENCE.md` - Command reference

## 🐛 Troubleshooting

**Validation fails**: Check for duplicate IDs or names  
**Import errors**: Verify TSV format and UTF-8 encoding  
**Merge conflicts**: Work with color files, not master file  

For more help, see documentation in `../../docs/`
