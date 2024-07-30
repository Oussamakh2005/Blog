"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_EMAIL_PASSWORD = exports.APP_EMAIL = exports.JWT_SECRET_KEY = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//variables :
exports.PORT = process.env.PORT;
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.APP_EMAIL = process.env.APP_EMAIL;
exports.APP_EMAIL_PASSWORD = process.env.APP_EMAIL_PASSWORD;
