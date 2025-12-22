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
            state: this.context,
            config: config,
            events: [...this.eventQueue] // Send copy of current events
        };
    }
}

module.exports = new GameEngine();