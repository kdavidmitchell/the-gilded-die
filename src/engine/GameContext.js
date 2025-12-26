// src/engine/GameContext.js
const { TITHES, CRUEL_FORTUNES_CATALOG } = require('../config');

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

// Extend GameContext with serialization
GameContext.prototype.toJSON = function () {
    return {
        currentTitheIndex: this.currentTitheIndex,
        currentRound: this.currentRound,
        sessionFavor: this.sessionFavor,
        tribute: this.tribute,
        // Map fortunes to just their IDs and remaining duration/state
        activeFortunes: this.activeFortunes.map(f => ({
            id: f.id,
            duration: f.duration,
            // Preserve interactive state if any
            isInteractive: f.isInteractive
        })),
        inventory: this.inventory, // Inventory objects are simple JSON usually
        successfulRollsThisTurn: this.successfulRollsThisTurn,
        isGildedCageActive: this.isGildedCageActive,
        malusAcceptedThisTithe: this.malusAcceptedThisTithe,
        dieSize: this.dieSize,
        lastRoll: this.lastRoll,
        pendingInteraction: this.pendingInteraction
    };
};

GameContext.fromJSON = function (data) {
    const ctx = new GameContext();
    Object.assign(ctx, data);

    // Re-hydrate fortunes from Catalog to restore functions (onRoll, etc)
    ctx.activeFortunes = data.activeFortunes.map(savedF => {
        const catalogEntry = CRUEL_FORTUNES_CATALOG[savedF.id];

        if (!catalogEntry) {
            console.warn(`[GameContext] Failed to hydrate fortune: ${savedF.id}. Catalog keys: ${Object.keys(CRUEL_FORTUNES_CATALOG).join(', ')}`);
            return savedF; // Fallback
        }

        return {
            ...catalogEntry,
            ...savedF // Override duration/state from saved data
        };
    });

    return ctx;
};