"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("@hephaestus/eris");
const list_1 = __importDefault(require("./list"));
exports.default = (0, eris_1.createCommand)({
    type: 1,
    name: 'character',
    description: 'List or modify your characters!',
    options: [list_1.default]
});
