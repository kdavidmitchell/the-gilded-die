// src/engine/states/RollProcessingState.js
const BaseState = require('./BaseState');
const { rollDice, calculateRollScore } = require('../../utils');
const { INFERNAL_EDICTS } = require('../../config');

class RollProcessingState extends BaseState {
    constructor(preRolledDice = null, skipIntervention = false) {
        super();
        this.preRolledDice = preRolledDice;
        this.skipIntervention = skipIntervention;
    }

    enter(engine) {
        const ctx = engine.context;

        // 1. DECAY
        if (!this.skipIntervention) this.decayFortunes(engine);
        
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
            .sort((a,b) => b.priority - a.priority)[0];

        if (triggeredEdict) {
            const EdictState = require('./EdictState');
            engine.transitionTo(new EdictState(triggeredEdict));
            return;
        }

        // 5. SCORING
        const { score, isBust } = calculateRollScore(dice, ctx.dieSize);
        
        if (isBust) {
            this.handleBust(engine);
        } else {
            this.handleSuccess(engine, score);
        }
    }

    decayFortunes(engine) {
        const ctx = engine.context;
        const expired = [];
        ctx.activeFortunes.forEach(f => f.duration--);
        ctx.activeFortunes = ctx.activeFortunes.filter(f => {
            if (f.duration <= 0) {
                expired.push(f.name);
                return false;
            }
            return true;
        });
        if (expired.length > 0) engine.addEvent('info', `Effects expired: ${expired.join(', ')}`);
    }

    handleBust(engine) {
        const TitheResolutionState = require('./TitheResolutionState');
        
        // Ensure Tribute is wiped
        engine.context.tribute = 0; 
        
        // Explicit BUST event
        engine.addEvent('bust', "BUST! The roll is worthless.");
        
        // Increment round
        engine.context.currentRound++;
        
        // Transition to resolution (which then goes to Idle/Next Turn)
        engine.transitionTo(new TitheResolutionState());
    }

    handleSuccess(engine, score) {
        const TurnState = require('./TurnState');
        engine.context.tribute += score;
        engine.addEvent('roll', `+${score} Tribute.`);
        engine.transitionTo(new TurnState());
    }
}

module.exports = RollProcessingState;