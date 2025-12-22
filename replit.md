# The Gilded Die

## Overview
A dice-based game with a dark tavern atmosphere. Players interact with "The Proprietor" in a mysterious gambling machine setting.

## Tech Stack
- **Backend**: Node.js with Express 5.x
- **Frontend**: Vanilla HTML/CSS/JavaScript served as static files
- **Port**: 5000 (bound to 0.0.0.0)

## Project Structure
```
├── public/              # Static frontend files
│   ├── audio/           # Sound effects
│   ├── images/          # Proprietor character images
│   ├── client.js        # Frontend JavaScript
│   ├── index.html       # Main HTML page
│   └── style.css        # Styling
├── src/
│   ├── engine/          # Game engine
│   │   ├── states/      # Game state machine states
│   │   ├── GameContext.js
│   │   └── GameEngine.js
│   ├── config.js        # Game configuration
│   ├── logger.js        # Logging utility
│   └── utils.js         # Utility functions
├── server.js            # Express server entry point
└── package.json         # Node.js dependencies
```

## Running the Application
```bash
npm start
```

## API Endpoints
- `GET /api/gamestate` - Get current game state
- `GET /api/intro` - Get intro data
- `POST /api/taketurn` - Take a turn
- `POST /api/roll` - Roll the dice
- `POST /api/stop` - Stop rolling
- `GET /api/shop` - Get shop options
- `POST /api/shop/buy` - Purchase an item
- `GET /api/hoard` - Get player inventory
- `POST /api/claim` - Claim a reward
- `POST /api/input` - Generic input handler
