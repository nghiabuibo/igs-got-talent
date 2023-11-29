'use strict';

module.exports = function getRandomCode(length = 8, sourceString) {
    if (!sourceString) sourceString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomChars = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * sourceString.length);
        randomChars += sourceString.charAt(randomIndex);
    }

    return randomChars;
}