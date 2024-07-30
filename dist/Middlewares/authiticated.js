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
exports.Authenticated = void 0;
const token_1 = require("../Services/token");
const __1 = require("..");
const Unauthrized_1 = require("../Execeptions/Unauthrized");
const root_1 = require("../Execeptions/root");
class Authenticated {
    static main(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.token;
            if (!token) {
                next(new Unauthrized_1.Unauthrized("Unauthrized", root_1.ErrorCode.UNAUTHRIZED, null));
            }
            try {
                const payload = token_1.Token.verify(token);
                const user = yield __1.prisma.user.findFirst({
                    where: {
                        id: payload.userId
                    }
                });
                req.user = user;
                next();
            }
            catch (err) {
                next(new Unauthrized_1.Unauthrized("Unauthrized", root_1.ErrorCode.UNAUTHRIZED, null));
            }
            ;
        });
    }
}
exports.Authenticated = Authenticated;
