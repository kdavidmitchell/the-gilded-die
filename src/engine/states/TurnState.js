// src/engine/states/TurnState.js
const BaseState = require('./BaseState');

class TurnState extends BaseState {
    enter(engine) {
        if (engine.context.isGildedCageActive) {
            engine.addEvent('edict', "The Gilded Cage creates a heavy pressure... You MUST roll.");
        }
    }

    handleRoll(engine) {
        const RollProcessingState = require('./RollProcessingState');
        engine.transitionTo(new RollProcessingState());
    }

    handleStop(engine) {
        if (engine.context.isGildedCageActive) {
            engine.addEvent('bust', "The Gilded Cage prevents you from stopping!", { mood: 'angry' });
            return;
        }

        const ctx = engine.context;
        const banked = ctx.tribute;
        
        if (banked > 100) engine.addEvent('quip', "\"Prudence. How... boring.\"", { mood: 'bored' });

        ctx.sessionFavor += banked;
        engine.addEvent('bank', `You bank ${banked} tribute.`, { amount: banked });

        ctx.currentRound++; // Increment Round
        
        // End of Turn -> Check Tithe
        const TitheResolutionState = require('./TitheResolutionState');
        engine.transitionTo(new TitheResolutionState());
    }
}

module.exports = TurnState;