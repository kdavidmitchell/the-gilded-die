// src/engine/states/SynergyState.js
const BaseState = require('./BaseState');
const { SINISTER_SYNERGIES, SACRED_SYNERGIES } = require('../../config');

class SynergyState extends BaseState {
    enter(engine) {
        const ctx = engine.context;
        const allSynergies = [...SINISTER_SYNERGIES, ...SACRED_SYNERGIES];
        let synergyFound = false;

        // Get list of owned item IDs
        const inventoryIds = ctx.inventory.map(i => i.prizeId);

        allSynergies.forEach(recipe => {
            // Check if we have all components
            const hasComponents = recipe.components.every(comp => inventoryIds.includes(comp));
            
            if (hasComponents) {
                synergyFound = true;
                this.forgeSynergy(engine, recipe);
            }
        });

        // Whether we found something or not, the game ends here.
        this.triggerGameOver(engine);
    }

    forgeSynergy(engine, recipe) {
        const ctx = engine.context;
        
        // Remove components from inventory
        ctx.inventory = ctx.inventory.filter(item => !recipe.components.includes(item.prizeId));
        
        // Add Result
        ctx.inventory.push({
            prizeId: recipe.result.name.toLowerCase().replace(/ /g, '_'),
            name: recipe.result.name,
            description: recipe.result.description,
            isSynergy: true,
            tier: 'Synergy'
        });

        engine.addEvent('edict', `SYNERGY REVEALED: The '${recipe.result.name}' has formed.`);
        engine.addEvent('quip', "\"Ah... I see your collection has evolved.\"", { mood: 'excited' });
    }

    triggerGameOver(engine) {
        const ctx = engine.context;
        
        if (ctx.sessionFavor > 1000) {
            engine.addEvent('quip', "\"An impressive performance. You have satisfied the contract.\"", { mood: 'bored' });
        } else {
            engine.addEvent('quip', "\"The contract is fulfilled. You may leave... for now.\"", { mood: 'neutral' });
        }

        engine.addEvent('gameover', "Refresh the page to play again.");
    }
}

module.exports = SynergyState;