"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecretKey = void 0;
const generateSecretKey = () => {
    return `AIUEB-${(Math.random() + 1).toString(36)}`;
};
exports.generateSecretKey = generateSecretKey;
