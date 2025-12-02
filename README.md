# Uma Musume Calculator 🐎✨

A comprehensive web application for calculating Uma Musume racing statistics and managing character data.

## Features

### 🏁 Umapyoi Calculator
- **58 Uma Musume Characters**: Complete roster with 57 unique avatars + variants (Wedding, Summer, Halloween, etc.)
- **439 Racing Skills**: Organized by 7 colors (IUS, Golden, Yellow, Blue, Green, Red, Purple)
- **Aptitude System**: Auto-adjust based on character's Track, Distance, and Style aptitudes (S-A, B-C, D-E-F, G)
- **Stats Calculation**: Calculate racing performance based on Speed, Stamina, Power, Guts, and Wisdom (0-9999)
- **Skill Management**: Add and manage racing skills with automatic score calculation and aptitude multipliers
- **Star Rating System**: Set character star levels (1-5 stars) affecting unique skill scores
- **Unique Skills**: Display character-specific unique abilities (180-260 points)
- **Real-time Updates**: Instant calculation updates as you modify stats, aptitudes, or skills

### 🌐 Bilingual Support
- **Vietnamese & English**: Complete bilingual interface
- **Auto-save Language**: Remembers your language preference
- **Seamless Switching**: Toggle between languages without losing data

### 🎵 Background Music
- **Auto-play**: Subtle background music at 13% volume
- **Mute Function**: Toggle sound on/off (music continues playing)
- **Volume Control**: Adjust audio levels to your preference
- **Loop Playback**: Continuous audio experience

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: 44px minimum touch targets
- **Cross-Device**: Consistent experience on desktop, tablet, and mobile
- **Modern Layout**: CSS Grid with responsive breakpoints

### 👨‍💻 Author's Corner
- **How to Use Guide**: Comprehensive usage instructions
- **Contact Information**: Direct links to Facebook and email
- **Development Notes**: Insights from the developer
- **Bilingual Content**: Available in both Vietnamese and English

## Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**: Modern web standards
- **Modular Architecture**: 9 separate JS modules using IIFE pattern
  - Core: main.js, calculator.js, dataManager.js
  - Systems: skillSystem.js, aptitudeSystem.js, statsSystem.js, starRating.js
  - Features: uniqueSkill.js, overallScore.js, uiUpdater.js
- **Design**: CSS Grid, Flexbox, Responsive Design (mobile-first)
- **Audio**: HTML5 Audio API (background music at 13% volume)
- **Storage**: localStorage for language preferences
- **Assets**: 57 individual character avatars + custom icons

### Data Management
- **JSON**: Character database (58 Uma), Skills database (439 skills), Aptitudes database (43 Uma × 10 types)
- **Modular Skills**: 7 color-separated files (IUS: 57, Golden: 114, Yellow: 106, Blue: 26, Green: 74, Red: 30, Purple: 32)
- **TSV Import/Export**: Excel-friendly bulk editing workflow
- **Python 3**: Build tools for split/merge/validate/import operations
- **Alphabetical Sorting**: Skills auto-sorted in all dropdowns for easy navigation

## Project Structure

```
uma-musume-calculator/
├── index.html              # Main calculator page
├── styles.css             # Main stylesheet
├── js/                    # Modular JavaScript files (9 modules)
│   ├── main.js           # Application initialization & coordination
│   ├── dataManager.js    # Data loading (characters, skills, aptitudes)
│   ├── calculator.js     # Calculation functions
│   ├── uiUpdater.js      # UI updates and display
│   ├── starRating.js     # Star rating system (1-5 stars)
│   ├── uniqueSkill.js    # Unique skill handling (from uma_musume.json)
│   ├── statsSystem.js    # 5 main stats management (0-9999 range)
│   ├── skillSystem.js    # Skills list and scoring (with aptitude multipliers)
│   ├── aptitudeSystem.js # Aptitude auto-adjustment (4-tier system)
│   └── overallScore.js   # Total score calculation
├── assets/
│   ├── pages/
│   │   └── somethingtosay.html  # Author's guide page
│   ├── data/
│   │   ├── uma_musume.json      # Character database (58 Uma with unique skills)
│   │   ├── aptitudes.json       # Aptitudes database (43 Uma × 10 types)
│   │   └── test.json            # Test data
│   ├── avatars/                 # Character avatar images (57 individual + 1 placeholder)
│   ├── img/                     # Stat icons (speed, stamina, power, guts, wits)
│   └── audio/                   # Background music files
├── libs/                  # Skills database & tools
│   ├── skills_lib.json           # Master skills file (auto-generated)
│   ├── skills_index.json         # Skills metadata index
│   ├── skills/                   # Individual skill files by color (439 total)
│   │   ├── ius.json             # Intrinsic/Unique Skills (57)
│   │   ├── golden.json          # Golden skills (114)
│   │   ├── yellow.json          # Yellow skills (106)
│   │   ├── blue.json            # Blue skills (26)
│   │   ├── green.json           # Green skills (74)
│   │   ├── red.json             # Red skills (30)
│   │   └── purple.json          # Purple skills (32)
│   ├── scripts/                  # Python 3 build tools
│   │   ├── split_skills.py          # Split master file into colors
│   │   ├── merge_skills.py          # Merge colors into master file
│   │   ├── validate_skills.py       # Validate skill data integrity
│   │   ├── import_from_tsv.py       # TSV import/export for bulk editing
│   │   └── tsv.bat                  # Windows batch helper for TSV
│   └── backup/                   # Automatic backup files
└── docs/                  # Documentation
    ├── HUONG_DAN.md              # Comprehensive Vietnamese guide (450+ lines)
    ├── SKILLS_README.md          # Skills system overview
    ├── QUICK_REFERENCE.md        # Python tools quick reference
    ├── TSV_IMPORT_GUIDE.md       # Detailed TSV workflow guide
    ├── TSV_QUICK_START.md        # Quick start for TSV editing
    ├── SKILL_TEMPLATES.md        # Skill data templates
    ├── IMPLEMENTATION_SUMMARY.md # Technical implementation notes
    └── REFACTORING_SUMMARY.md    # Refactoring changelog
```

## Quick Start

### For Users (Calculator)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/runeeyes584/uma-musume-calculator.git
   cd uma-musume-calculator
   ```

2. **Add background music** (optional):
   - Place your music file in `assets/audio/`
   - Rename it to `background-music.mp3`
   - Music plays at 13% volume with mute toggle

3. **Open in browser**:
   - Simply open `index.html` in your web browser
   - No build process or server required!

4. **Using the calculator**:
   - Select Uma Musume → Aptitudes auto-fill (10 types)
   - Set star rating (1-5) and stats (0-9999)
   - Add skills (alphabetically sorted, 439 total)
   - Unique skill displays automatically
   - Score adjusts with aptitude multipliers (S-A: 1.0, B-C: 0.8, D-E-F: 0.6, G: 0.5)

### For Developers (Skills Management)

**Skills Database**: 439 skills organized by color in `libs/skills/`
**Character Database**: 58 Uma Musume in `assets/data/uma_musume.json`
**Aptitudes Database**: 43 Uma × 10 types in `assets/data/aptitudes.json`

**Quick TSV Editing** (Windows):
```cmd
cd libs
tsv.bat export golden          # Export golden skills to Excel
# Edit golden_skills.tsv in Excel
tsv.bat import golden_skills.tsv golden update  # Import changes
python validate_skills.py      # Validate integrity
```

**Python Tools**:
```bash
cd libs/scripts
python split_skills.py         # Split master file → color files
python merge_skills.py         # Merge color files → master file
python validate_skills.py      # Check data integrity (439 skills)
python import_from_tsv.py export blue           # Export to TSV
python import_from_tsv.py import blue_skills.tsv blue update  # Import from TSV
```

**Documentation**:
- `docs/HUONG_DAN.md` - **Comprehensive Vietnamese guide** (450+ lines, consolidated)
- `docs/SKILLS_README.md` - Complete skills system overview
- `docs/TSV_QUICK_START.md` - Quick start for TSV workflow
- `docs/QUICK_REFERENCE.md` - Python tools reference
- `docs/TSV_IMPORT_GUIDE.md` - Detailed TSV guide

## Usage

### Basic Calculator Usage
1. **Select Uma**: Choose your character from 58 available (aptitudes auto-fill)
2. **Check Aptitudes**: 10 types (Turf, Dirt, Sprint, Mile, Medium, Long, Front, Pace, Late, End) in 4 tiers
3. **Enter Stats**: Input Speed, Stamina, Power, Guts, Wisdom (0-9999 range)
4. **Set Stars**: Adjust star rating (1-5 stars) for unique skill bonus
5. **View Unique Skill**: Character-specific ability displays automatically (180-260 points)
6. **Add Skills**: Click "Add skill" from 439 alphabetically sorted skills
7. **View Results**: Total score includes stats + skills + unique skill + aptitude multipliers

### Advanced Features
- **Aptitude System**: 4-tier structure (S-A, B-C, D-E-F, G) with automatic adjustment when Uma selected
- **Aptitude Multipliers**: Skills scored with multipliers (S-A: 1.0, B-C: 0.8, D-E-F: 0.6, G: 0.5)
- **Skill Sorting**: 439 skills alphabetically ordered across 7 colors for easy searching
- **Golden Skills**: 114 premium upgraded abilities with enhanced effects
- **Track Conditions**: Skills adapt based on track type (Turf/Dirt) and distance (Sprint/Mile/Medium/Long)
- **Strategy Matching**: Optimize for Front, Pace, Late, or End running styles
- **Individual Avatars**: 57/58 Uma with unique character images (98.3% coverage)

## Data Sources

Character and skill data are sourced from:
- **Uma Musume Pretty Derby** official game (58 characters with unique skills)
- **Community databases** and wikis (skill effects and descriptions)
- **Aptitudes data** from game stats (43 Uma × 10 aptitude types)
- **Manual compilation** and verification (439 skills across 7 colors)
- **Avatar images** from official game assets and community resources

## Contributing

This is currently a solo project by **Kaleidoscope Runeeyes**. If you'd like to contribute:

1. **Report Issues**: Use GitHub issues for bug reports
2. **Suggest Features**: Share your ideas through issues
3. **Update Skills**: Use TSV workflow to edit 439 skills in Excel
   - Export: `cd libs && tsv.bat export <color>`
   - Edit in Excel/LibreOffice
   - Import: `tsv.bat import <file>.tsv <color> update`
   - Validate: `cd scripts && python validate_skills.py`
4. **Add Characters**: Update `assets/data/uma_musume.json` (currently 58 Uma)
5. **Update Aptitudes**: Edit `assets/data/aptitudes.json` (43 Uma × 10 types)
6. **Add Avatars**: Place PNG files in `assets/avatars/` with consistent naming
7. **Translations**: Assist with additional language support (Vietnamese guide available)

See `docs/TSV_QUICK_START.md` for detailed contribution workflow.

## Contact

- **Facebook**: [https://www.facebook.com/HCruneeyes]
- **Email**: [anhtienle428@gmail.com]

## Development Notes

### Architecture
- **Modular JavaScript**: 9 ES6 IIFE modules (main, dataManager, calculator, skillSystem, aptitudeSystem, statsSystem, starRating, uniqueSkill, overallScore, uiUpdater)
- **Skills Database v2.0**: 439 skills split into 7 color-based files (alphabetically sorted in UI)
- **Aptitude System**: 4-tier structure with auto-adjustment and skill score multipliers
- **Metadata Tracking**: All skills have id, rarity, updated, check_type, condition fields
- **Excel Workflow**: TSV import/export for bulk editing without merge conflicts
- **Avatar Management**: 57 individual character images + 1 placeholder (98.3% coverage)

### Project Status
- **One-Person Project**: Updates may be slower than expected
- **Active Development**: Aptitude system, unique skills, and Vietnamese documentation recently added
- **Feedback Welcome**: Please report any bugs or suggestions via GitHub issues
- **Last Major Update**: December 2025 - Aptitude System, Unique Skills Display, 57 Individual Avatars, Vietnamese Guide (HUONG_DAN.md)

### Statistics
- **439 Skills**: IUS (57), Golden (114), Yellow (106), Blue (26), Green (74), Red (30), Purple (32)
- **58 Uma Musume**: All with unique skills and descriptions
- **43 Aptitude Sets**: 10 types per Uma (Turf, Dirt, Sprint, Mile, Medium, Long, Front, Pace, Late, End)
- **57 Individual Avatars**: 98.3% character coverage with unique images

## License

This project is for educational and fan purposes. Uma Musume Pretty Derby is owned by Cygames.

## Acknowledgments

- **Uma Musume Community**: For data and inspiration
- **Cygames**: For creating Uma Musume Pretty Derby
- **Contributors**: Everyone who helped test and provide feedback

---

**Made with ❤️ for the Uma Musume community**

*Last updated: December 2, 2025*
