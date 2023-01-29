"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharacter = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const BASE_URL = "https://xivapi.com/character";
const getCharacter = async (id) => {
    const requestUrl = `${BASE_URL}/${id}`;
    const response = await (0, node_fetch_1.default)(requestUrl);
    if (response.status !== 200) {
        throw new Error(`Unable to fetch character details, reason: ${response.statusText} | ${response.status}`);
    }
    const { Character: { DC: dataCenter, Name: name, Server: world, Avatar: avatarUrl, Portrait: portraitUrl, } } = await response.json();
    return {
        name,
        world,
        avatarUrl,
        dataCenter,
        portraitUrl,
    };
};
exports.getCharacter = getCharacter;
