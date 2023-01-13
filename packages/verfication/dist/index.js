"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCharacter = void 0;
const needle_1 = __importDefault(require("needle"));
const verifyCharacter = (key, charURI) => {
    const charURL = new URL(charURI);
    const charID = charURL.pathname.split('/')[3];
    return new Promise((resolve, reject) => {
        needle_1.default.get(`https://xivapi.com/character/${charID}`, (error, response) => {
            if (error) {
                reject(error);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Unable to pefrom request: ${response.statusMessage} | ${response.statusCode}`));
            }
            const { Bio: bio } = response.body.Character;
            if (bio.includes(key)) {
                resolve();
            }
            else {
                reject(new Error('Invalid Key.'));
            }
        });
    });
};
exports.verifyCharacter = verifyCharacter;
