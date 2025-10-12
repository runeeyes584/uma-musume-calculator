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

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Design**: CSS Grid, Flexbox, Responsive Design
- **Audio**: HTML5 Audio API
- **Storage**: localStorage for preferences
- **Icons**: Custom PNG assets
- **Data**: JSON-based character and skill databases

## Project Structure

```
Uma/
├── index.html              # Main calculator page
├── script.js              # Main JavaScript logic
├── styles.css             # Main stylesheet
├── assets/
│   ├── pages/
│   │   └── somethingtosay.html  # Author's guide page
│   ├── data/
│   │   ├── uma_musume.json      # Character database
│   │   └── test.json            # Test data
│   ├── avatars/                 # Character avatar images
│   ├── img/                     # Stat icons (speed, stamina, power, guts, wits)
│   └── audio/                   # Background music files
└── libs/
    └── skills_lib.json         # Skills database
```

## Setup & Installation

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
3. **Data Updates**: Help keep character/skill data current
4. **Translations**: Assist with additional language support

## Contact

- **Facebook**: [https://www.facebook.com/HCruneeyes]
- **Email**: [anhtienle428@gmail.com]

## Development Notes

- **One-Person Project**: Updates may be slower than expected
- **Work in Progress**: Some features (Uma selection display) are still being developed
- **Feedback Welcome**: Please report any bugs or suggestions

## License

This project is for educational and fan purposes. Uma Musume Pretty Derby is owned by Cygames.

## Acknowledgments

- **Uma Musume Community**: For data and inspiration
- **Cygames**: For creating Uma Musume Pretty Derby
- **Contributors**: Everyone who helped test and provide feedback

---

**Made with ❤️ for the Uma Musume community**

*Last updated: October 2025*
