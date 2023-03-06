"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharZoneRanks = void 0;
const needle_1 = __importDefault(require("needle"));
const schemas_1 = require("./schemas");
function processRequest(body) {
    return new Promise((res, rej) => {
        needle_1.default.post('https://www.fflogs.com/api/v2/client', JSON.stringify({ ...body }), {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FF_LOGS_TOKEN}`
            }
        }, (error, resp) => error !== undefined
            ? res(resp)
            : rej(error));
    });
}
const getCharZoneRanks = async (name, slug, region) => {
    const response = await processRequest({
        query: schemas_1.CharacterZoneQuery,
        variables: {
            name,
            slug,
            region
        }
    });
    if (response.statusCode !== 200) {
        throw new Error(`Error on request: ${response.statusMessage} | ${response.statusCode}`);
    }
    if (!response.body.data.characterData.character) {
        throw new Error('No logs found.');
    }
    return response.body
        .data
        .characterData
        .character
        .zoneRankings
        .rankings;
};
exports.getCharZoneRanks = getCharZoneRanks;
