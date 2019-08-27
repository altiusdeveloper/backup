"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return a random int, used by `random.getUid()`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
exports.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * Return a unique identifier with the given `length`.
 *
 * @param {Number} length
 * @return {String}
 * @api private
 */
exports.getUid = (length) => {
    let uid = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charsLength = chars.length;
    for (let i = 0; i < length; ++i) {
        uid += chars[exports.getRandomInt(0, charsLength - 1)];
    }
    return uid;
};
//# sourceMappingURL=random.js.map