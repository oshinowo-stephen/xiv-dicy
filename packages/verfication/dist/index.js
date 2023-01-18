"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCharacter = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = require("cheerio");
const verifyCharacter = async (_key, charURI) => {
    const response = await (0, node_fetch_1.default)(charURI);
    const page = await response.text();
    const $ = (0, cheerio_1.load)(page);
    const charBio = $.html('.character__selfintroduction');
    const bio = $(charBio).text();
    if (!bio.includes(_key)) {
        throw new Error('Invalid Key.');
    }
};
exports.verifyCharacter = verifyCharacter;
