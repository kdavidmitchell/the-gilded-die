// src/engine/states/RewardState.js
const BaseState = require('./BaseState');
const { PRIZES } = require('../../config');

class RewardState extends BaseState {
    enter(engine) {
        engine.context.isChoosingReward = true; 
        engine.addEvent('info', "Select your reward from the trove.");
    }

    handleClaimReward(engine, { prizeIndex }) {
        const ctx = engine.context;
        const currentTithe = ctx.getCurrentTithe();
        
        // Safety check
        if (!currentTithe) return; 

        const prizeList = PRIZES[currentTithe.tier];
        
        if (!prizeList || !prizeList[prizeIndex]) {
            engine.addEvent('error', "Invalid selection.");
            return;
        }

        const selectedPrize = prizeList[prizeIndex];
        // Ensure store 'prizeId' to match the Synergy check later
        ctx.inventory.push({ ...selectedPrize, prizeId: selectedPrize.id, tier: currentTithe.number });
        
        engine.addEvent('roll', `You claimed: ${selectedPrize.name}`);
        
        ctx.isChoosingReward = false;
        ctx.currentTitheIndex++;
        ctx.currentRound = 1;

        // ROUTING LOGIC:
        if (ctx.getCurrentTithe()) {
            // Next Tithe exists -> Continue Game
            const IdleState = require('./IdleState');
            engine.transitionTo(new IdleState());
        } else {
            // No Tithes left -> End Game Sequence
            const SynergyState = require('./SynergyState');
            engine.transitionTo(new SynergyState());
        }
    }
}

module.exports = RewardState;