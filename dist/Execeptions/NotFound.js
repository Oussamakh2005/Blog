"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const root_1 = require("./root");
class NotFound extends root_1.HttpExeception {
    constructor(message, errorCode, error) {
        super(message, errorCode, 404, error);
    }
}
exports.NotFound = NotFound;
