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
            description: this.edict.description 
        });
        
        engine.addEvent('quip', "\"System Override.\"", { mood: 'excited' });

        const result = this.edict.execute(engine.context);

        if (result && result.type === 'force_roll') {
            engine.addEvent('info', "The dice are rolling themselves...");
            setTimeout(() => engine.transitionTo(new RollProcessingState()), 1000);
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
}

module.exports = EdictState;