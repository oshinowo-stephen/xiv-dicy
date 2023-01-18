"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCharacter = exports.vCache = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = require("cheerio");
exports.vCache = [];
const verifyCharacter = async (_key, charURI) => {
    const characterCache = exports.vCache.find(({ cache }) => cache.character === charURI);
    if (characterCache.duration > Date.now()) {
        const response = await (0, node_fetch_1.default)(charURI);
        const page = await response.text();
        const $ = (0, cheerio_1.load)(page);
        const charBio = $.html('.character__selfintroduction');
        const bio = $(charBio).text();
        exports.vCache.push({
            cache: {
                bio,
                character: charURI,
            },
            duration: Date.now() + 5 * 1000
        });
        if (!bio.includes(_key)) {
            throw new Error('Invalid Key.');
        }
    }
    else {
        throw new Error('This character is in the cache!');
    }
};
exports.verifyCharacter = verifyCharacter;
