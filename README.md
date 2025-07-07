# War Card Game

A modern, interactive implementation of the classic card game "War" (known as "Bataille" in French) built with HTML, CSS, and JavaScript. This project demonstrates clean architecture, object-oriented programming principles, and modern web development practices.

## 🎮 Game Overview

War is a simple yet engaging card game where two players compete to win all cards from a standard 52-card deck. The game is entirely based on chance, making it perfect for quick entertainment.

### Game Rules

1. **Setup**: A standard 52-card deck is shuffled and divided equally between two players (26 cards each)
2. **Gameplay**: Both players simultaneously reveal the top card from their deck
3. **Winning Rounds**: The player with the higher card value wins both cards and places them at the bottom of their deck
4. **War (Tie)**: When both cards have the same value, a "war" occurs:
   - Each player places one card face down, then another card face up
   - The player with the higher face-up card wins all cards in play
   - If there's another tie, the war continues
5. **Victory**: The game ends when one player has all 52 cards

## 🚀 Features

- **Modern UI**: Clean, responsive design with smooth animations
- **Interactive Gameplay**: Click-to-play with keyboard shortcuts (Space bar)
- **Auto-Play Mode**: Watch the game play itself with adjustable speed
- **Visual Feedback**: Card animations, winner highlighting, and battle indicators
- **Game Statistics**: Track rounds played, battles fought, and longest battle sequences
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real Card Images**: Uses authentic French playing card assets

## 🏗️ Architecture

This project follows modern software engineering principles:

### Design Patterns Used

1. **MVC Pattern**: Separation of Model (game logic), View (UI), and Controller (user interactions)
2. **Observer Pattern**: Event-driven architecture for game state changes
3. **Factory Pattern**: Card and deck creation
4. **Strategy Pattern**: Different game ending scenarios

### Class Structure

```
Card.js          - Represents individual playing cards
Deck.js          - Manages collections of cards with shuffle/deal functionality
Player.js        - Manages player state and card collections
GameEngine.js    - Core game logic and state management
GameUI.js        - User interface and visual representation
main.js          - Application initialization and orchestration
```

## 🛠️ Technical Implementation

### Technologies Used

- **HTML5**: Semantic markup with modern elements
- **CSS3**: 
  - CSS Grid and Flexbox for layout
  - CSS Custom Properties for theming
  - CSS Animations and Transitions
  - Responsive design with media queries
- **JavaScript ES6+**:
  - Classes and inheritance
  - Arrow functions
  - Destructuring
  - Template literals
  - Async/await patterns

### Key Features

- **Object-Oriented Design**: Proper encapsulation and abstraction
- **Event-Driven Architecture**: Loose coupling between components
- **Error Handling**: Comprehensive error management
- **Performance Optimization**: Efficient DOM manipulation
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile-First Design**: Responsive layout for all devices

## 📁 Project Structure

```
Bataille/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Application styles
├── scripts/
│   ├── Card.js            # Card class definition
│   ├── Deck.js            # Deck management
│   ├── Player.js          # Player logic
│   ├── GameEngine.js      # Core game engine
│   ├── GameUI.js          # User interface management
│   └── main.js            # Application entry point
├── assets/
│   └── img/               # Card images organized by suit
│       ├── Coeurs/        # Hearts (♥)
│       ├── Carreaux/      # Diamonds (♦)
│       ├── Piques/        # Spades (♠)
│       ├── Trèfles/       # Clubs (♣)
│       └── dos_de_carte.jpg # Card back image
└── README.md              # This file
```

## 🎯 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Start Playing** by clicking "New Game"

### For Development

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Then visit: http://localhost:8000
```

## 🎮 How to Play

1. **Start a Game**: Click "New Game" to shuffle and deal cards
2. **Play Rounds**: Click "Play Round" or press the Space bar
3. **Auto-Play**: Click "Auto Play" to watch the game play itself
4. **Game End**: The game ends when one player has all cards

### Controls

- **New Game**: Initialize a new game
- **Play Round**: Play one round manually
- **Auto Play**: Toggle automatic gameplay
- **Space Bar**: Play a round (keyboard shortcut)
- **ESC**: Stop auto-play (keyboard shortcut)

## 📊 Game Statistics

The game tracks various statistics:

- **Total Rounds**: Number of rounds played
- **Battles**: Number of war situations
- **Longest Battle**: Maximum cards involved in a single war
- **Game Duration**: Time taken to complete the game

## 🎨 Customization

### Themes

The game uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --background-color: #0f172a;
    /* ... more variables */
}
```

### Card Assets

Replace card images in the `assets/img/` directory following the naming convention:
- `01-Coeur.png` to `13_King-Coeur.png` for Hearts
- Similar patterns for other suits

## 🔧 Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Card images sourced from traditional French playing card designs
- Inspired by the classic card game enjoyed worldwide
- Built with modern web technologies and best practices

## 📧 Contact

For questions, suggestions, or contributions, please feel free to reach out or submit an issue.

---

**Enjoy playing War! May the cards be in your favor!** 🎴✨