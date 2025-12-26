// server.js
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const GameEngine = require('./src/engine/GameEngine');

const app = express();

// --- ENVIRONMENT DETECTION ---
const isReplit = !!process.env.REPL_ID || !!process.env.REPLIT_SLUG;

// --- CONFIGURATION ---
const PORT = process.env.PORT || 5000;
const HOST = isReplit ? '0.0.0.0' : 'localhost';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Session Middleware
app.use(session({
    store: new FileStore({
        path: './sessions',
        ttl: 86400, // 1 day
        retries: 0
    }),
    secret: 'the-gilded-die-secret-key-change-me',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Game Engine Middleware: Hydrate or Create
app.use((req, res, next) => {
    // Skip static assets or irrelevant paths
    if (req.path.startsWith('/audio') || req.path.startsWith('/images') || req.path.startsWith('/css')) {
        return next();
    }

    if (req.session.gameState) {
        // Hydrate existing session
        req.game = GameEngine.hydrate(req.session.gameState);
    } else {
        // New Game
        req.game = new GameEngine();
        req.session.gameState = req.game.serialize();
    }
    next();
});

// Helper to save state after action
const saveAndRespond = (req, res, responseData) => {
    req.session.gameState = req.game.serialize();
    res.json(responseData);
};

// --- API Endpoints ---

// 1. Get State
app.get('/api/gamestate', (req, res) => {
    res.json(req.game.getPublicState());
});

// 2. Intro Data 
app.get('/api/intro', (req, res) => {
    const { INTRO_DATA } = require('./src/config');
    res.json(INTRO_DATA);
});

// 3. Core Game Loop
app.post('/api/taketurn', (req, res) => {
    const result = req.game.handleInput('handleTakeTurn');
    saveAndRespond(req, res, result);
});

app.post('/api/roll', (req, res) => {
    const result = req.game.handleInput('handleRoll');
    saveAndRespond(req, res, result);
});

app.post('/api/stop', (req, res) => {
    const result = req.game.handleInput('handleStop');
    saveAndRespond(req, res, result);
});

// 4. Shop & Items
app.get('/api/shop', (req, res) => {
    const { CRUEL_FORTUNES_CATALOG, FIENDISH_UPGRADES } = require('./src/config');
    const state = req.game.context; // Read-only access doesn't strictly need serialize but consistent is good

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
    const result = req.game.handleInput('handleShopPurchase', { itemId });
    saveAndRespond(req, res, result);
});

app.get('/api/hoard', (req, res) => {
    const inventory = req.game.context.inventory;
    res.json(inventory);
});

app.post('/api/claim', (req, res) => {
    const { prizeIndex } = req.body;
    const result = req.game.handleInput('handleClaimReward', { prizeIndex });
    saveAndRespond(req, res, result);
});

app.post('/api/input', (req, res) => {
    const { action, payload } = req.body;
    const result = req.game.handleInput(action, payload);
    saveAndRespond(req, res, result);
});

// 5. System
app.post('/api/restart', (req, res) => {
    // Create fresh game
    req.game = new GameEngine();
    req.session.gameState = req.game.serialize();

    // Return the new state + explicit restart event if needed, or just standard state
    const result = req.game.getPublicState();

    // Optional: Add a 'restart' event so frontend can clear logs?
    // For now the frontend just renders state, so a fresh state should be fine.
    // Maybe force a reload on frontend?
    // result.events.push({ type: 'info', text: 'System Rebooted.' });

    res.json(result);
});


// --- Initialization ---

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
    const protocol = isReplit ? 'https' : 'http';
    const displayHost = isReplit ? `0.0.0.0` : 'localhost';
    const url = `${protocol}://${displayHost}:${PORT}`;

    console.log(`\n==================================================`);
    console.log(`   THE GILDED DIE IS RUNNING`);
    console.log(`   ENVIRONMENT: ${isReplit ? 'CLOUD (Replit)' : 'LOCAL'}`);
    console.log(`   ADDRESS:     ${url}`);
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