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
exports.fetchCharacter = exports.storeCharacter = exports.fetchPlayer = exports.createPlayerIfNotExists = void 0;
const client_1 = require("@prisma/client");
const storage = new client_1.PrismaClient();
const createPlayerIfNotExists = (player) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.fetchPlayer)(player);
    }
    catch (_error) {
        yield storage.player.create({
            data: {
                id: player
            }
        });
    }
});
exports.createPlayerIfNotExists = createPlayerIfNotExists;
const fetchPlayer = (player) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = yield storage.player.findUnique({ where: { id: player } });
    const characters = yield storage.character.findMany({ where: { playerID: player } });
    return { id, characters };
});
exports.fetchPlayer = fetchPlayer;
const storeCharacter = (player, char) => __awaiter(void 0, void 0, void 0, function* () {
    const characters = yield storage.character.findMany({ where: { playerID: player } });
    yield storage.character.create({
        data: {
            name: char.name,
            playerID: player,
            world: char.world,
            charURI: char.charURI,
            priority: char.priority === undefined
                ? characters.length >= 1
                    ? characters[characters.length - 1].priority + 1
                    : 0
                : char.priority
        }
    });
});
exports.storeCharacter = storeCharacter;
const fetchCharacter = (player, charName, url) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, world, priority, charURI } = yield storage.character.findFirst({ where: {
            playerID: player,
            name: charName,
            charURI: url,
        }
    });
    return { name, world, priority, charURI };
});
exports.fetchCharacter = fetchCharacter;
