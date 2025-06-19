// fix jsdom missing structuredClone

if (typeof globalThis.structuredClone === 'undefined') {
    globalThis.structuredClone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

if (typeof globalThis.structuredClone === 'undefined') {
    const {structuredClone} = require('node:structured-clone'); // Node 17+
    globalThis.structuredClone = structuredClone;
}