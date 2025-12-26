// src/engine/states/BaseState.js
class BaseState {
    enter(engine) { }
    exit(engine) { }

    // Default implementations (no-op or error)
    handleTakeTurn(engine) { engine.addEvent('info', "It is not time to start a turn."); }
    handleRoll(engine) { engine.addEvent('info', "You cannot roll right now."); }
    handleStop(engine) { engine.addEvent('info', "You cannot stop right now."); }
    handleShopPurchase(engine) { engine.addEvent('info', "The shop is closed."); }
    handleClaimReward(engine) { engine.addEvent('info', "There is no reward to claim."); }

    serialize() {
        return { type: this.constructor.name, data: {} };
    }
}
module.exports = BaseState;