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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
process.env['NODE_CONFIG_DIR'] = process.env.NODE_ENV !== 'prod'
    ? (0, path_1.resolve)(process.cwd(), '../config')
    : (0, path_1.resolve)(process.cwd(), './config');
const eris_1 = require("@hephaestus/eris");
const auth_1 = require("@aiueb/auth");
const utils_1 = require("@hephaestus/utils");
const config_1 = __importDefault(require("config"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.loadTokenToEnv)();
    const magician = new eris_1.Hephaestus(config_1.default.get('BOT_TOKEN'), {
        intents: [
            'guilds',
            'guildMessages'
        ]
    });
    magician.client.on('ready', () => {
        utils_1.logger.info('Client ready! Magician is now online!');
    });
    magician.commands.forge((0, path_1.join)(__dirname, 'commands'));
    yield magician.connect();
    utils_1.logger.info('App connecting to the DiscordAPI...');
});
main().catch(console.error);
