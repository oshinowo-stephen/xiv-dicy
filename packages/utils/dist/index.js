"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.randomString = exports.deleteTimeout = exports.createTimeout = exports.timeouts = void 0;
exports.timeouts = new Set();
function createTimeout(value, seconds) {
    exports.timeouts.add(value);
    setTimeout(() => exports.timeouts.delete(value), seconds);
}
exports.createTimeout = createTimeout;
function deleteTimeout(value) {
    for (const timeout of exports.timeouts) {
        if (timeout === value) {
            exports.timeouts.delete(timeout);
        }
    }
}
exports.deleteTimeout = deleteTimeout;
const randomString = (length) => {
    const digits = '1234567890';
    const charsUpper = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const charsLower = charsUpper.toLowerCase();
    const chars = `${charsUpper}${charsLower}${digits}`;
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
};
exports.randomString = randomString;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
