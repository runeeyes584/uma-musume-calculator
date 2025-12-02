# Uma Musume Calculator 🐎✨

A comprehensive web application for calculating Uma Musume racing statistics and managing character data.

## Features

### 🏁 Umapyoi Calculator
- **Character Selection**: Choose from a wide variety of Uma Musume characters
- **Stats Calculation**: Calculate racing performance based on Speed, Stamina, Power, Guts, and Wisdom
- **Skill Management**: Add and manage racing skills with automatic score calculation
- **Star Rating System**: Set character star levels (1-5 stars)
- **Unique Skills**: Display character-specific unique abilities
- **Real-time Updates**: Instant calculation updates as you modify stats

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
- **Modular Architecture**: 8 separate JS modules using IIFE pattern
- **Design**: CSS Grid, Flexbox, Responsive Design
- **Audio**: HTML5 Audio API
- **Storage**: localStorage for preferences
- **Icons**: Custom PNG assets

### Data Management
- **JSON**: Character database (uma_musume.json), Skills database (362 skills)
- **Modular Skills**: 7 color-separated files for easier maintenance
- **TSV Import/Export**: Excel-friendly bulk editing workflow
- **Python 3**: Build tools for split/merge/validate/import operations

## Project Structure

```
uma-musume-calculator/
├── index.html              # Main calculator page
├── styles.css             # Main stylesheet
├── js/                    # Modular JavaScript files
│   ├── main.js           # Application initialization
│   ├── dataManager.js    # Data loading (characters, skills)
│   ├── calculator.js     # Calculation functions
│   ├── uiUpdater.js      # UI updates and display
│   ├── starRating.js     # Star rating system
│   ├── uniqueSkill.js    # Unique skill handling
│   ├── statsSystem.js    # 5 main stats management
│   ├── skillSystem.js    # Skills list and scoring
│   └── overallScore.js   # Total score calculation
├── assets/
│   ├── pages/
│   │   └── somethingtosay.html  # Author's guide page
│   ├── data/
│   │   ├── uma_musume.json      # Character database
│   │   └── test.json            # Test data
│   ├── avatars/                 # Character avatar images
│   ├── img/                     # Stat icons (speed, stamina, power, guts, wits)
│   └── audio/                   # Background music files
├── libs/                  # Skills database & tools
│   ├── skills_lib.json           # Master skills file (auto-generated)
│   ├── skills_index.json         # Skills metadata index
│   ├── skills/                   # Individual skill files by color
│   │   ├── ius.json             # Inherited skills (45)
│   │   ├── golden.json          # Golden skills (74)
│   │   ├── yellow.json          # Yellow skills (86)
│   │   ├── red.json             # Red skills (30)
│   │   ├── green.json           # Green skills (73)
│   │   ├── blue.json            # Blue skills (22)
│   │   └── purple.json          # Purple skills (32)
│   ├── split_skills.py          # Split master file into colors
│   ├── merge_skills.py          # Merge colors into master file
│   ├── validate_skills.py       # Validate skill data integrity
│   ├── import_from_tsv.py       # TSV import/export for bulk editing
│   └── tsv.bat                  # Windows batch helper for TSV
└── docs/                  # Documentation
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
   - See `assets/audio/README.md` for detailed instructions

3. **Open in browser**:
   - Simply open `index.html` in your web browser
   - No build process or server required!

### For Developers (Skills Management)

**Skills Database**: 362 skills organized by color in `libs/skills/`

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
cd libs
python split_skills.py         # Split master file → color files
python merge_skills.py         # Merge color files → master file
python validate_skills.py      # Check data integrity (362 skills)
python import_from_tsv.py export blue           # Export to TSV
python import_from_tsv.py import blue_skills.tsv blue update  # Import from TSV
```

**Documentation**:
- `docs/SKILLS_README.md` - Complete skills system overview
- `docs/TSV_QUICK_START.md` - Quick start for TSV workflow
- `docs/QUICK_REFERENCE.md` - Python tools reference
- `docs/TSV_IMPORT_GUIDE.md` - Detailed TSV guide

## Usage

### Basic Calculator Usage
1. **Select Uma**: Choose your character from the dropdown
2. **Enter Stats**: Input your Speed, Stamina, Power, Guts, and Wisdom values
3. **Add Skills**: Click "Add skill" to include racing abilities
4. **Set Stars**: Adjust the star rating (1-5 stars)
5. **View Results**: See calculated scores and ratings in real-time

### Advanced Features
- **Skill Sorting**: Skills are alphabetically ordered for easy searching
- **Gold Skills**: Special upgraded abilities with enhanced effects
- **Track Conditions**: Skills adapt based on track type and distance
- **Strategy Matching**: Optimize for Front, Pace, Late, or End strategies

## Data Sources

Character and skill data are sourced from:
- Uma Musume Pretty Derby official game
- Community databases and wikis
- Manual data compilation and verification

## Contributing

This is currently a solo project by **Kaleidoscope Runeeyes**. If you'd like to contribute:

1. **Report Issues**: Use GitHub issues for bug reports
2. **Suggest Features**: Share your ideas through issues
3. **Update Skills**: Use TSV workflow to edit skills in Excel
   - Export: `tsv.bat export <color>`
   - Edit in Excel/LibreOffice
   - Import: `tsv.bat import <file>.tsv <color> update`
   - Validate: `python validate_skills.py`
4. **Add Characters**: Update `assets/data/uma_musume.json`
5. **Translations**: Assist with additional language support

See `docs/TSV_QUICK_START.md` for detailed contribution workflow.

## Contact

- **Facebook**: [https://www.facebook.com/HCruneeyes]
- **Email**: [anhtienle428@gmail.com]

## Development Notes

### Architecture
- **Modular JavaScript**: Refactored from 1355-line monolith to 8 focused modules
- **Skills Database v2.0**: Split from 2627-line file to 7 color-based files (200-400 lines each)
- **Metadata Tracking**: All 362 skills now have id, rarity, updated, check_type fields
- **Excel Workflow**: TSV import/export for bulk editing without merge conflicts

### Project Status
- **One-Person Project**: Updates may be slower than expected
- **Work in Progress**: Some features (Uma selection display) are still being developed
- **Feedback Welcome**: Please report any bugs or suggestions
- **Last Major Update**: October 2025 - Modularization & Skills v2.0

## License

This project is for educational and fan purposes. Uma Musume Pretty Derby is owned by Cygames.

## Acknowledgments

- **Uma Musume Community**: For data and inspiration
- **Cygames**: For creating Uma Musume Pretty Derby
- **Contributors**: Everyone who helped test and provide feedback

---

**Made with ❤️ for the Uma Musume community**

*Last updated: October 2025*
