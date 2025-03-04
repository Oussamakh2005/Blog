"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordSchema = exports.ResetPasswordSchema = exports.LoginSchema = exports.NewUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.NewUserSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8).max(20),
});
exports.LoginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8).max(20),
});
exports.ResetPasswordSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.UpdatePasswordSchema = zod_1.default.object({
    password: zod_1.default.string().min(8).max(20),
});
