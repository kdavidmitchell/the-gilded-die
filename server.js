// server.js
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const gameEngine = require('./src/engine/GameEngine');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- API Endpoints ---

// 1. Get State
app.get('/api/gamestate', (req, res) => {
    res.json(gameEngine.getPublicState());
});

// 2. Intro Data 
app.get('/api/intro', (req, res) => {
    const { INTRO_DATA } = require('./src/config');
    res.json(INTRO_DATA);
});

// 3. Core Game Loop
app.post('/api/taketurn', (req, res) => {
    res.json(gameEngine.handleInput('handleTakeTurn'));
});

app.post('/api/roll', (req, res) => {
    res.json(gameEngine.handleInput('handleRoll'));
});

app.post('/api/stop', (req, res) => {
    res.json(gameEngine.handleInput('handleStop'));
});

// 4. Shop & Items
app.get('/api/shop', (req, res) => {
    // 1. Get Config & State
    const { CRUEL_FORTUNES_CATALOG, FIENDISH_UPGRADES } = require('./src/config');
    const gameEngine = require('./src/engine/GameEngine');
    const state = gameEngine.context;
    
    // 2. Filter Upgrades
    const nextUpgrade = Object.values(FIENDISH_UPGRADES)
        .sort((a, b) => a.dieSize - b.dieSize) // Sort smallest to largest
        .find(u => u.dieSize > state.dieSize); // Find the FIRST one larger than current

    // 3. Build Options
    const options = {
        boons: [CRUEL_FORTUNES_CATALOG.fiends_echo],
        maluses: !state.malusAcceptedThisTithe ? [CRUEL_FORTUNES_CATALOG.shackled_hand] : [],
        upgrades: nextUpgrade ? [nextUpgrade] : [] // Only send the next upgrade
    };
    
    res.json(options);
});

app.post('/api/shop/buy', (req, res) => {
    const { itemId } = req.body;
    res.json(gameEngine.handleInput('handleShopPurchase', { itemId }));
});

app.get('/api/hoard', (req, res) => {
    const inventory = gameEngine.context.inventory;
    res.json(inventory); 
});

app.post('/api/claim', (req, res) => {
    const { prizeIndex } = req.body;
    res.json(gameEngine.handleInput('handleClaimReward', { prizeIndex }));
});

app.post('/api/input', (req, res) => {
    const { action, payload } = req.body;
    // Routes generic inputs to the engine
    res.json(gameEngine.handleInput(action, payload));
});

// --- Initialization ---

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`The Gilded Die is open for business at http://localhost:${PORT}`);
    console.log("The Proprietor is waiting...");

    const startCommand = (process.platform === 'darwin' ? 'open' : 
                          process.platform === 'win32' ? 'start' : 
                          'xdg-open');
                          
    exec(`${startCommand} ${url}`, (err) => {
        if (err) {
            console.log("Could not automatically open browser. Please open the link manually.");
        }
    });
});