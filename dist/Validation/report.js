"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReportSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateReportSchema = zod_1.default.object({
    content: zod_1.default.string().min(20).max(100)
});
