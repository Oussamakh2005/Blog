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
exports.Role = void 0;
const Unauthrized_1 = require("../Execeptions/Unauthrized");
const root_1 = require("../Execeptions/root");
class Role {
    static adminModerator(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role == "ADMIN" || req.user.role == "MODERATOR") {
                next();
            }
            else {
                next(new Unauthrized_1.Unauthrized("Unauthrized (you are not admin or moderator)", root_1.ErrorCode.UNAUTHRIZED, null));
            }
        });
    }
    static admin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role === "ADMIN") {
                next();
            }
            else {
                next(new Unauthrized_1.Unauthrized("Unauthrized", root_1.ErrorCode.UNAUTHRIZED, null));
            }
        });
    }
}
exports.Role = Role;
