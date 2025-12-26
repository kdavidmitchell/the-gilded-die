// src/engine/states/RollProcessingState.js
const BaseState = require('./BaseState');
const { rollDice, calculateRollScore } = require('../../utils');
const { INFERNAL_EDICTS } = require('../../config');

class RollProcessingState extends BaseState {
    constructor(preRolledDice = null, skipIntervention = false, skipDecay = false) {
        super();
        this.preRolledDice = preRolledDice;
        this.skipIntervention = skipIntervention;
        this.skipDecay = skipDecay;
    }

    serialize() {
        return {
            type: 'RollProcessingState',
            data: {
                preRolledDice: this.preRolledDice,
                skipIntervention: this.skipIntervention,
                skipDecay: this.skipDecay
            }
        };
    }

    enter(engine) {
        const ctx = engine.context;

        // 1. DECAY
        if (!this.skipDecay) this.decayFortunes(engine);

        // 2. ROLL
        let dice = this.preRolledDice || rollDice(5, ctx.dieSize);
        if (!this.preRolledDice) {
            ctx.activeFortunes.forEach(f => {
                if (!f.isInteractive && f.onRoll) dice = f.onRoll(dice, ctx.dieSize);
            });
        }
        ctx.lastRoll = dice;

        // 3. INTERVENTION
        if (!this.skipIntervention) {
            const guidance = ctx.activeFortunes.find(f => f.id === 'whispered_guidance');
            if (guidance) {
                const FortuneInputState = require('./FortuneInputState');
                engine.transitionTo(new FortuneInputState(dice, guidance));
                return;
            }
        }

        // 4. EDICTS
        const triggeredEdict = INFERNAL_EDICTS
            .filter(e => e.checker(dice))
            .sort((a, b) => b.priority - a.priority)[0];

        if (triggeredEdict) {
            const EdictState = require('./EdictState');
            engine.transitionTo(new EdictState(triggeredEdict));
            return;
        }

        // 5. SCORING
        // Destructure 'favor' alongside score and isBust
        const { score, favor, isBust } = calculateRollScore(dice, ctx.dieSize);

        // You get this currency even if you bust (e.g., rolling a single 12 on d12s)
        if (favor > 0) {
            ctx.sessionFavor += favor;
        }

        if (isBust) {
            this.handleBust(engine, favor); // Pass favor to customize the failure message
        } else {
            this.handleSuccess(engine, score, favor); // Pass favor to customize success message
        }
    }

    decayFortunes(engine) {
        const ctx = engine.context;
        const expired = [];

        ctx.activeFortunes.forEach(f => f.duration--);

        ctx.activeFortunes = ctx.activeFortunes.filter(f => {
            if (f.duration <= 0) {
                expired.push(f.name);

                if (f.id === 'gilded_cage') {
                    ctx.isGildedCageActive = false;
                }

                return false;
            }
            return true;
        });

        if (expired.length > 0) {
            engine.addEvent('info', `Effects expired: ${expired.join(', ')}`);
        }
    }

    handleBust(engine, favorGained) {
        const TitheResolutionState = require('./TitheResolutionState');

        // Ensure Tribute is wiped
        engine.context.tribute = 0;

        // Explicit BUST event
        // If we busted but gained favor from a Crit, acknowledge it
        const msg = favorGained > 0
            ? `BUST! No matches... but the High Roll grants +${favorGained} Favor.`
            : "BUST! The roll is worthless.";

        engine.addEvent('bust', msg);

        // Increment round
        engine.context.currentRound++;

        // Transition to resolution
        engine.transitionTo(new TitheResolutionState());
    }

    handleSuccess(engine, score, favorGained) {
        const TurnState = require('./TurnState');

        engine.context.tribute += score;

        // Update Log
        // Show both resources generated
        const msg = favorGained > 0
            ? `+${score} Tribute. +${favorGained} Favor.`
            : `+${score} Tribute.`;

        engine.addEvent('roll', msg);
        engine.transitionTo(new TurnState());
    }
}

module.exports = RollProcessingState;