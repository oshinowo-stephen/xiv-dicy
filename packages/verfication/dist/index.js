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
    const charName = $.html('.frame__chara__name');
    const charWorld = $.html('.frame__chara__world');
    if (!$(charBio).text().includes(_key))
        throw new Error('Invalid Key.');
    return {
        name: $(charName).text(),
        world: $(charWorld).text()
    };
};
exports.verifyCharacter = verifyCharacter;
