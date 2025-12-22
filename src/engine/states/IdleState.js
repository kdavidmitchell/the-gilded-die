// src/engine/states/IdleState.js
const BaseState = require('./BaseState');
const { CRUEL_FORTUNES_CATALOG, FIENDISH_UPGRADES } = require('../../config');

class IdleState extends BaseState {
    enter(engine) {
        // Safety check: If the game is actually over, stop.
        if (!engine.context.getCurrentTithe()) {
            engine.addEvent('gameover', "The contract is concluded.");
        }
    }

    handleTakeTurn(engine) {
        engine.context.resetTurnData();
        engine.addEvent('info', "You take a deep breath and prepare the dice.");
        const TurnState = require('./TurnState');
        engine.transitionTo(new TurnState());
    }

    handleShopPurchase(engine, { itemId }) {
        const ctx = engine.context;
        
        // 1. SEARCH: Check Fortunes (Boons & Maluses)
        const fortune = Object.values(CRUEL_FORTUNES_CATALOG).find(f => f.id === itemId);
        
        if (fortune) {
            if (fortune.type === 'boon') {
                this._buyBoon(engine, ctx, fortune);
            } else if (fortune.type === 'malus') {
                this._acceptMalus(engine, ctx, fortune);
            }
            return;
        }

        // 2. SEARCH: Check Upgrades
        const upgrade = Object.values(FIENDISH_UPGRADES).find(u => u.id === itemId);
        if (upgrade) {
            this._buyUpgrade(engine, ctx, upgrade);
            return;
        }

        // 3. FALLBACK: Item not found
        engine.addEvent('error', "Item not found in the ledger.");
    }

    // --- Private Helper Methods ---

    _buyBoon(engine, ctx, item) {
        if (ctx.sessionFavor < item.cost) {
            engine.addEvent('error', "Insufficient Favor.");
            return;
        }

        ctx.sessionFavor -= item.cost;
        ctx.activeFortunes.push({ ...item });

        engine.addEvent('shop_buy', `DEAL STRUCK: You purchased '${item.name}'.`, {
            itemType: 'boon',
            itemName: item.name
        });
        
        // Boons make the game easier, so the Fiend is bored
        engine.addEvent('quip', "\"A crutch? How disappointing.\"", { mood: 'bored' });
    }

    _acceptMalus(engine, ctx, item) {
        if (ctx.activeFortunes.some(f => f.id === item.id)) {
            engine.addEvent('error', "You already bear this burden.");
            return;
        }

        const isExempt = item.id === 'shackled_hand';
        if (!isExempt && ctx.malusAcceptedThisTithe) {
            engine.addEvent('error', "You have already accepted a Malus this Tithe.");
            return;
        }

        ctx.sessionFavor += item.reward;
        ctx.activeFortunes.push({ ...item });
        
        // Only flag the tithe limit if it's NOT the exempt item
        if (!isExempt) {
            ctx.malusAcceptedThisTithe = true;
        }

        engine.addEvent('shop_buy', `PACT SEALED: You accepted '${item.name}' (+${item.reward} Favor).`, {
            itemType: 'malus', itemName: item.name
        });
        engine.addEvent('quip', "\"Now things are getting interesting...\"", { mood: 'excited' });
    }

    _buyUpgrade(engine, ctx, item) {
        if (ctx.sessionFavor < item.cost) {
            engine.addEvent('error', "Insufficient Favor.");
            return;
        }

        ctx.sessionFavor -= item.cost;
        ctx.dieSize = item.dieSize;

        engine.addEvent('shop_buy', `ASCENSION: Your dice have transformed into d${ctx.dieSize}s!`, {
            itemType: 'upgrade',
            itemName: `d${item.dieSize} Dice`
        });
        
        engine.addEvent('quip', "\"More sides... more suffering.\"", { mood: 'neutral' });
    }
}

module.exports = IdleState;