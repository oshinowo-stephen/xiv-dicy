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
const utils_1 = require("@aiueb/utils");
const service_1 = require("../service");
const isVerified = (player, charURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, service_1.fetchCharacter)(player, undefined, charURL);
        return true;
    }
    catch (_error) {
        console.log(_error);
        return false;
    }
});
exports.default = (0, eris_1.createCommand)({
    type: 1,
    name: 'verify',
    options: [
        {
            type: 3,
            required: true,
            name: 'char_link',
            description: 'character\'s link/url',
        }
    ],
    description: 'Verify your characters!',
    action: (interaction, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (utils_1.timeouts.has(interaction.member.id))
            return interaction.createMessage({
                content: 'Hold on! This command is already in process!',
                flags: 64
            });
        const playerID = interaction.member.id;
        const character = args['char_link'].value;
        if (!(0, service_1.isValidProfile)(character))
            return interaction.createMessage({
                content: 'This isn\'t a valid character... Please try a different link',
                flags: 64
            });
        const verified = yield isVerified(playerID, character);
        yield (0, service_1.createPlayerIfNotExists)(playerID);
        if (verified)
            return interaction.createMessage({
                content: 'You\'ve already verified this character silly UwU',
                flags: 64
            });
        (0, utils_1.createTimeout)(interaction.member.id, (50 * 1000));
        const key = `lyralogs-${(0, utils_1.randomString)(28)}`;
        interaction.createMessage({
            content: `
Alright! Here's your key: \`${key}\`. 
Please paste this in your character's profile!
Found here: https://na.finalfantasyxiv.com/lodestone/my/setting/profile/
`,
            flags: 64,
        });
        try {
            const { name, world } = yield (0, service_1.tryToVerify)(key, character, 0);
            yield (0, service_1.storeCharacter)(playerID, {
                name,
                world,
                charURI: character
            }).catch((err) => {
                interaction.createMessage({
                    content: `
That might be a problem... Please report this to my master (<@229651386223034368>):
\`\`\`
${err}
\`\`\` 
                    `,
                    flags: 64
                });
            });
            (0, utils_1.deleteTimeout)(playerID);
            interaction.createMessage({
                content: `Validated: **"${name}"** from **"${world}"**`,
                flags: 64
            });
        }
        catch (_error) {
            console.log(_error);
            (0, utils_1.deleteTimeout)(playerID);
            interaction.createMessage({
                content: `Sorry but I was unable to verify this character, reason: \`${_error}\``,
                flags: 64,
            });
        }
    })
});
