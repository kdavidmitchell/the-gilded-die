// src/engine/GameEngine.js
const GameContext = require('./GameContext');

class GameEngine {
    constructor() {
        this.context = new GameContext();
        this.currentState = null;
        this.eventQueue = [];

        // Lazy load initial state
        const IdleState = require('./states/IdleState');
        this.transitionTo(new IdleState());
    }

    transitionTo(newState) {
        if (this.currentState) this.currentState.exit(this);
        this.currentState = newState;
        this.currentState.enter(this);
    }

    addEvent(type, text, extra = {}) {
        this.eventQueue.push({ type, text, ...extra });
    }

    handleInput(actionName, payload = {}) {
        // 1. CLEAR QUEUE BEFORE ACTION
        this.eventQueue = [];

        // 2. EXECUTE ACTION
        if (this.currentState && typeof this.currentState[actionName] === 'function') {
            this.currentState[actionName](this, payload);
        } else {
            // Fallback for invalid actions
            console.warn(`Action ${actionName} invalid in ${this.currentState?.constructor.name}`);
            this.addEvent('error', "Action not permitted.");
        }

        // 3. RETURN SNAPSHOT
        return this.getPublicState();
    }

    getPublicState() {
        const config = require('../config');
        return {
            state: { ...this.context }, // Spread to bypass toJSON and send full objects to client
            config: config,
            events: [...this.eventQueue] // Send copy of current events
        };
    }

    serialize() {
        return {
            context: this.context.toJSON(),
            currentState: this.currentState ? this.currentState.serialize() : null,
            eventQueue: this.eventQueue
        };
    }

    static hydrate(data) {
        const engine = new GameEngine();

        // Restore Context
        engine.context = GameContext.fromJSON(data.context);
        engine.eventQueue = data.eventQueue || [];

        // Restore State
        if (data.currentState) {
            const { type, data: stateData } = data.currentState;
            try {
                // Dynamically require the state class
                const StateClass = require(`./states/${type}`);

                // Special handling for states with constructor args
                let stateInstance;
                if (type === 'FortuneInputState') {
                    // Need to look up the fortune object from config
                    const { CRUEL_FORTUNES_CATALOG } = require('../config');
                    const fortune = CRUEL_FORTUNES_CATALOG[stateData.fortuneId];
                    stateInstance = new StateClass(stateData.currentDice, fortune);
                } else if (type === 'EdictState') {
                    const { INFERNAL_EDICTS } = require('../config');
                    const edict = INFERNAL_EDICTS.find(e => e.name === stateData.edictName); // Need to save edictName in EdictState
                    stateInstance = new StateClass(edict);
                } else if (type === 'RollProcessingState') {
                    stateInstance = new StateClass(stateData.preRolledDice, stateData.skipIntervention, stateData.skipDecay);
                } else {
                    stateInstance = new StateClass();
                    Object.assign(stateInstance, stateData);
                }

                engine.currentState = stateInstance;
                // Note: We do NOT call enter() on hydration, as we are restoring an existing state
            } catch (e) {
                console.error(`Failed to hydrate state ${type}:`, e);
                // Fallback to Idle
                const IdleState = require('./states/IdleState');
                engine.currentState = new IdleState();
            }
        }

        return engine;
    }
}

module.exports = GameEngine;