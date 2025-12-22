// src/engine/states/TitheResolutionState.js
const BaseState = require('./BaseState');
const { PRIZES } = require('../../config');
const { selectCorruptedPrize } = require('../../utils'); 

class TitheResolutionState extends BaseState {
    enter(engine) {
        const ctx = engine.context;
        const tithe = ctx.getCurrentTithe();
        
        const IdleState = require('./IdleState');

        // We only resolve the Tithe (Win or Loss) if the player has exhausted their time.
        if (ctx.currentRound > tithe.rounds) {
            if (ctx.sessionFavor >= tithe.requiredFavor) {
                this.handleWin(engine, tithe);
            } else {
                this.handleLoss(engine, tithe);
            }
        } else {
            engine.transitionTo(new IdleState());
        }
    }

    handleWin(engine, tithe) {
        const ctx = engine.context;
        const RewardState = require('./RewardState');

        const excess = ctx.sessionFavor - tithe.requiredFavor;
        ctx.sessionFavor = excess; // Carry over excess
        
        engine.addEvent('edict', `--- Tithe ${tithe.number} Complete ---`);
        engine.addEvent('roll', `SUCCESS! Excess favor: ${excess}`);
        
        engine.transitionTo(new RewardState());
    }

    handleLoss(engine, tithe) {
        const ctx = engine.context;
        const SynergyState = require('./SynergyState');
        const IdleState = require('./IdleState');
        
        engine.addEvent('bust', "FAILURE! The Tithe is unmet.");

        // 1. SELECT CORRUPTED PRIZE
        const prizeList = PRIZES[tithe.tier] || [];
        if (prizeList.length > 0) {
            const prize = selectCorruptedPrize(prizeList);
            const fullDesc = (prize.description + " " + (prize.corrupted_suffix || "")).trim();

            ctx.inventory.push({ 
                prizeId: prize.id, 
                isCorrupted: true, 
                tier: tithe.number,
                name: prize.corrupted_name || `Corrupted ${prize.name}`,
                description: fullDesc
            });

            engine.addEvent('bust', `The Fiend mocks you with a corrupted gift: ${prize.corrupted_name || prize.name}`);
            engine.addEvent('quip', "\"Disappointing. Perhaps this will motivate you.\"", { mood: 'excited' });
        }

        // 2. PUNISHMENT
        ctx.sessionFavor = 0;

        // 3. ADVANCE
        ctx.currentTitheIndex++;
        ctx.currentRound = 1;

        // 4. CHECK ROUTING
        if (ctx.getCurrentTithe()) {
            engine.transitionTo(new IdleState());
        } else {
            engine.transitionTo(new SynergyState());
        }
    }
}

module.exports = TitheResolutionState;