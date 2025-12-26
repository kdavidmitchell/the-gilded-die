// src/engine/states/EdictState.js
const BaseState = require('./BaseState');

class EdictState extends BaseState {
    constructor(edict) {
        super();
        this.edict = edict;
    }

    enter(engine) {
        // 1. LAZY LOAD STATES
        const TurnState = require('./TurnState');
        const RollProcessingState = require('./RollProcessingState');

        engine.addEvent('edict', `INFERNAL EDICT: ${this.edict.name}`, {
            description: this.edict.description,
            triggeringRoll: engine.context.lastRoll // Send triggering dice for UI to optionally show
        });

        // Explicitly show the roll that caused it in the log text for clarity
        engine.addEvent('info', `The dice align [${engine.context.lastRoll.join(', ')}]... the Edict is spoken.`);

        engine.addEvent('quip', "\"System Override.\"", { mood: 'excited' });

        const result = this.edict.execute(engine.context);

        if (result && result.type === 'force_roll') {
            engine.addEvent('info', "The way back is shut. You must roll again.");
            engine.transitionTo(new TurnState());
        }
        else if (result && result.type === 'input_required') {
            engine.context.pendingInteraction = 'edict_choice';
            engine.addEvent('input_req', result.prompt);
        }
        else {
            engine.transitionTo(new TurnState());
        }
    }

    handleInputResponse(engine, { value }) {
        const TurnState = require('./TurnState');
        engine.transitionTo(new TurnState());
    }

    serialize() {
        return {
            type: 'EdictState',
            data: { edictName: this.edict.name }
        };
    }
}

module.exports = EdictState;