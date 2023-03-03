"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("@hephaestus/eris");
const fflogs_1 = require("@aiueb/fflogs");
const service_1 = require("../service");
exports.default = (0, eris_1.createCommand)({
    type: 1,
    name: 'encounters',
    options: [
        {
            type: 3,
            name: 'player',
            required: false,
            description: 'A target member/player',
        }
    ],
    description: 'List player\'s encounters',
    action: (interaction, args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let playerID = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.id;
        const target = args['player'];
        const encounters = [];
        if (target !== undefined)
            playerID = /<@([0-9]+)>/.exec(target.value)[1];
        try {
            const { characters } = (yield (0, service_1.fetchPlayer)(playerID));
            const { name, world: server } = (0, service_1.findMain)(characters);
            const { world, region } = getRegionAndWorld(server);
            const zoneRanks = yield (0, fflogs_1.getCharZoneRanks)(name, world, region);
            for (const encounter of zoneRanks) {
                const { encounter: { name }, totalKills, fastestKill, rankPercent, bestSpec, } = encounter;
                encounters.push({
                    name,
                    totalKills,
                    fastestKill,
                    specJob: bestSpec,
                    rankNumber: Math.floor(rankPercent),
                });
            }
            interaction.createMessage({
                embeds: [
                    {
                        title: `${name} | ${world} - Top Clears`,
                        fields: [
                            ...encounters.map((encounter) => {
                                return {
                                    name: `${encounter.name} | ${encounter.totalKills > 0 ? ':white_check_mark:' : '❌'}`,
                                    value: `
Total Kills: ${encounter.totalKills}
Fastest Kill: ${encounter.fastestKill}
Best Job: ${encounter.specJob} (${encounter.rankNumber})
                                    `
                                };
                            })
                        ]
                    }
                ],
                flags: 64
            });
        }
        catch (_error) {
            console.log(_error);
        }
    })
});
const getRegionAndWorld = (input) => {
    const world = input.split(' ')[0];
    const region = (0, service_1.getDCRegion)(/\[([A-Za-z]+)\]/.exec(input.split(' ')[1])[1]);
    return { world, region };
};
