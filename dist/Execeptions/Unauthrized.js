"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthrized = void 0;
const root_1 = require("./root");
class Unauthrized extends root_1.HttpExeception {
    constructor(message, errorCode, error) {
        super(message, errorCode, 401, error);
    }
}
exports.Unauthrized = Unauthrized;
