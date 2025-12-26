// src/engine/states/FortuneInputState.js
const BaseState = require('./BaseState');

class FortuneInputState extends BaseState {
    constructor(currentDice, fortune) {
        super();
        this.currentDice = currentDice;
        this.fortune = fortune;
    }

    enter(engine) {
        engine.addEvent('input_req', "Choose a die face to KEEP. All others will be re-rolled.", {
            inputType: 'face_selection',
            cancellable: true,
            dice: this.currentDice,
            dieSize: engine.context.dieSize
        });
    }

    serialize() {
        return {
            type: 'FortuneInputState',
            data: {
                currentDice: this.currentDice,
                fortuneId: this.fortune.id // Save ID instead of object
            }
        };
    }

    handleInput(engine, { value, skipped }) {
        const RollProcessingState = require('./RollProcessingState');
        const ctx = engine.context;

        // Skip logic
        if (skipped || !value) {
            engine.addEvent('info', "You ignore the whisper.");
            engine.transitionTo(new RollProcessingState(this.currentDice, true, false));
            return;
        }

        // Reroll logic
        const faceToKeep = parseInt(value);
        engine.addEvent('info', `Keeping ${faceToKeep}s...`);

        const newDice = this.currentDice.map(d => {
            if (d === faceToKeep) return d;
            return Math.floor(Math.random() * ctx.dieSize) + 1;
        });

        // Return to processing loop with NEW dice
        engine.transitionTo(new RollProcessingState(newDice, true, false));
    }
}

module.exports = FortuneInputState;