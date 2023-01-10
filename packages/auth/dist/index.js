"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTokenToEnv = void 0;
const needle_1 = __importDefault(require("needle"));
class RequestError extends Error {
    constructor(message, reason) {
        super(message);
        this.name = this.constructor.name;
        this.error = message;
        this.reason = reason;
        Error.captureStackTrace(this, this.constructor);
    }
}
const loadTokenToEnv = () => {
    return new Promise((resolve, reject) => {
        needle_1.default.post('https://www.fflogs.com/oauth/token', `grant_type=client_credentials&client_id=${process.env.FF_LOGS_CLIENT_ID}&client_secret=${process.env.FF_LOGS_CLIENT_SEC}`, (error, response) => {
            if (error) {
                reject(new RequestError(error.message, error.name));
            }
            if (response.statusCode !== 200) {
                reject(new RequestError('Error on request', response.statusMessage));
            }
            resolve(process.env['FF_LOGS_TOKEN'] = response.body.access_token);
        });
    });
};
exports.loadTokenToEnv = loadTokenToEnv;
