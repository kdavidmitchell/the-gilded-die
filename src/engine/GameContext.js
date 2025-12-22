// src/engine/GameContext.js
const { TITHES } = require('../config');

class GameContext {
    constructor() {
        this.currentTitheIndex = 0;
        this.currentRound = 1;
        this.sessionFavor = 0;
        this.tribute = 0;
        
        this.inventory = [];      // Array of items
        this.activeFortunes = []; // Array of active boons/maluses
        
        // Turn-specific flags
        this.successfulRollsThisTurn = 0;
        this.isGildedCageActive = false;
        this.malusAcceptedThisTithe = false;
        
        this.dieSize = 6;
        this.lastRoll = [];
        
        // Helper to track if we need to force input
        this.pendingInteraction = null; 
    }

    getCurrentTithe() {
        return TITHES[this.currentTitheIndex];
    }

    resetTurnData() {
        this.tribute = 0;
        this.successfulRollsThisTurn = 0;
        this.isGildedCageActive = false;
    }
}

module.exports = GameContext;