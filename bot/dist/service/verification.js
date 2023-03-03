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
exports.tryToVerify = exports.isValidProfile = void 0;
const utils_1 = require("@aiueb/utils");
const verify_1 = require("@aiueb/verify");
const isValidProfile = (input) => /https:\/\/na\.finalfantasyxiv\.com\/lodestone\/character\/([0-9]+)/gm
    .test(input);
exports.isValidProfile = isValidProfile;
const tryToVerify = (key, url, tries) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, world } = yield (0, verify_1.verifyCharacter)(key, url);
        console.log('trying to verify');
        return { name, world };
    }
    catch (_error) {
        console.log(_error.message);
        if (_error.message === 'Invalid Character.') {
            throw new Error('Invalid Character!');
        }
        console.log('current tries: ', tries);
        if (tries++ >= 10) {
            throw new Error('Maximum tries reached.');
        }
        yield (0, utils_1.sleep)(5000);
        return (0, exports.tryToVerify)(key, url, (tries++));
    }
});
exports.tryToVerify = tryToVerify;
