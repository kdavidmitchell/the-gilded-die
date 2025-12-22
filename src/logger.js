// logger.js
let isEnabled = true;

/**
 * Logs a message to the console only if the logger is enabled.
 * @param {string} message - The message to log.
 */
function log(message) {
    if (isEnabled) {
        console.log(message);
    }
}

/**
 * Enables or disables all logging.
 * @param {boolean} enabled - True to enable logging, false to disable.
 */
function setEnabled(enabled) {
    isEnabled = !!enabled;
}

module.exports = { log, setEnabled };