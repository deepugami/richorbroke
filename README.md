# Crypto Portfolio Guesser 

A fun browser-based questionnaire game that estimates your crypto portfolio size based on your DeFi/crypto activities and experiences.

## Features

- **19 Crypto-specific Questions**: From FTX drama to airdrop experiences
- **Smooth Animations**: Questions transition smoothly with modern UI effects
- **Navigation Controls**: 
  - Click YES/NO buttons
  - Use keyboard (Y/N or Arrow keys)
  - Scroll down to go back to previous questions
  - Touch/swipe support on mobile
- **Smart Scoring System**: Only YES answers count towards your score
- **Portfolio Estimation**: Results map to realistic portfolio size brackets

## How to Play

1. Open `index.html` in your browser
2. Answer each question honestly with YES or NO
3. Questions auto-advance after each answer
4. Scroll down to revisit previous questions
5. Get your estimated portfolio size with a fun comment!

## Scoring System

The game uses a sophisticated normalized scoring system:

### 1. Raw Score Calculation
- Only YES answers contribute to your score
- Each question has a weight based on rarity (-8 to +25 points)
- Raw score has a zero floor (negative scores become 0)
- Maximum possible raw score: 215 points

### 2. Normalization (0-100 Scale)
- Raw score is converted to a 0-100 normalized scale
- Formula: `normalized = floor((raw_score / max_raw_score) * 100)`
- This ensures stable scoring even if questions are added/removed

### 3. Portfolio Size Mapping
Questions are weighted based on their rarity in the crypto community:

- **Common activities**: +5 to +8 points (or negative for mistakes)
- **Fairly common**: +10 points
- **Uncommon**: +12 points  
- **Rare**: +15 points
- **Very rare**: +20 points
- **Ultra rare**: +25 points

## Portfolio Size Brackets

| Normalized Score | Estimated Portfolio | Distribution |
|------------------|-------------------|--------------|
| 0 – 20 | 100s | ~40% of players |
| 21 – 40 | 1,000s | ~35% of players |
| 41 – 60 | 10,000s | ~15% of players |
| 61 – 80 | 50,000s | ~8% of players |
| 81 – 100 | 100,000s+ | ~2% of players |

This distribution ensures most players (75%) fall into realistic lower brackets, while only the most experienced crypto users reach the highest tiers.

## Technical Details

- **Pure vanilla JavaScript** - No frameworks required
- **Responsive design** - Works on desktop and mobile
- **Modern CSS animations** - Smooth transitions and effects
- **Accessibility features** - Keyboard navigation support

## Files Structure

```
quiz-crypto/
├── index.html      # Main game interface
├── styles.css      # All styling and animations
├── script.js       # Game logic and interactions
└── README.md       # This file
```

## Customization

You can easily modify the game by editing:

- **Questions**: Update the `quizData` array in `script.js`
- **Scoring**: Adjust weights and portfolio brackets
- **Styling**: Modify colors, animations in `styles.css`
- **Comments**: Change the dank result messages in `portfolioBrackets`

## Browser Compatibility

Works on all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Enjoy discovering your crypto portfolio size!