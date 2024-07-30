"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCommentSchema = exports.PostImageSchema = exports.CreatePostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreatePostSchema = zod_1.default.object({
    content: zod_1.default.string().min(20).max(300)
});
exports.PostImageSchema = zod_1.default.object({
    originalname: zod_1.default.string().refine((name) => {
        const ext = name.split(".").pop();
        if (ext)
            return ["jpg", "jpeg", "gif", "webp", "png", "avif"].includes(ext === null || ext === void 0 ? void 0 : ext.toLowerCase());
    }),
    mimetype: zod_1.default.string().refine((type) => {
        return type.startsWith("image/");
    }, {
        message: "Invalid Mimetype ,only images are allowed.",
    }),
});
exports.AddCommentSchema = zod_1.default.object({
    content: zod_1.default.string().min(1).max(200),
});
