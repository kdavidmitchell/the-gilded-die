// server.js
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const gameEngine = require('./src/engine/GameEngine');

const app = express();

// --- ENVIRONMENT DETECTION ---
const isReplit = !!process.env.REPL_ID || !!process.env.REPLIT_SLUG;

// --- CONFIGURATION ---
const PORT = process.env.PORT || 5000;
// Replit requires 0.0.0.0 to expose the port to the internet.
// Locally, 'localhost' is safer and cleaner.
const HOST = isReplit ? '0.0.0.0' : 'localhost';

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
    const { CRUEL_FORTUNES_CATALOG, FIENDISH_UPGRADES } = require('./src/config');
    const state = gameEngine.context;
    
    // Filter Upgrades
    const nextUpgrade = Object.values(FIENDISH_UPGRADES)
        .sort((a, b) => a.dieSize - b.dieSize)
        .find(u => u.dieSize > state.dieSize);

    // Build Options
    const options = {
        boons: [CRUEL_FORTUNES_CATALOG.fiends_echo],
        maluses: !state.malusAcceptedThisTithe ? [CRUEL_FORTUNES_CATALOG.shackled_hand] : [],
        upgrades: nextUpgrade ? [nextUpgrade] : []
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
    res.json(gameEngine.handleInput(action, payload));
});

// --- Initialization ---

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
    const protocol = isReplit ? 'https' : 'http';
    const displayHost = isReplit ? `0.0.0.0 (Public)` : 'localhost';
    const url = `${protocol}://${isReplit ? req.get('host') : 'localhost'}:${PORT}`; // simplified for log

    console.log(`\n==================================================`);
    console.log(`   THE GILDED DIE IS RUNNING`);
    console.log(`   ENVIRONMENT: ${isReplit ? 'CLOUD (Replit)' : 'LOCAL'}`);
    console.log(`   ADDRESS:     http://${displayHost}:${PORT}`);
    console.log(`==================================================\n`);
    console.log("The Proprietor is waiting...");

    if (!isReplit) {
        console.log(">> Launching interface...");
        const startCommand = process.platform === 'darwin' ? 'open' 
                           : process.platform === 'win32' ? 'start' 
                           : 'xdg-open';
        
        exec(`${startCommand} http://localhost:${PORT}`);
    }
});