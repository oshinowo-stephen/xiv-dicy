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
const service_1 = require("../../service");
exports.default = (0, eris_1.createCommand)({
    type: 1,
    name: 'list',
    description: 'List your current or a player\'s characters!',
    options: [
        {
            type: 3,
            required: false,
            name: 'player',
            description: 'Player Tag/ID'
        }
    ],
    action: (interaction, args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let characters = [];
        const target = args['player'];
        let playerID = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.id;
        if (target !== undefined)
            playerID = /<@([0-9]+)>/.exec(target.value)[1];
        try {
            characters = (yield (0, service_1.fetchPlayer)(playerID)).characters;
        }
        catch (_error) {
            console.log(_error);
            return interaction.createMessage({
                content: 'I think we ran into an issue'
            });
        }
        interaction.createMessage({
            embeds: [
                {
                    fields: characters.map((character) => {
                        console.log(character);
                        return {
                            name: `-- ${character.priority === 0 ? 'Primary' : 'Alternate'} Character : ${character.name} -- `,
                            value: `
                            [Direct Link!](${character.charURI}) | ${character.world} 
                            `,
                        };
                    })
                }
            ]
        });
    })
});
