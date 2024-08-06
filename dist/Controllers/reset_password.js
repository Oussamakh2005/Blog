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
exports.ResetPassword = void 0;
const __1 = require("..");
const InternalException_1 = require("../Execeptions/InternalException");
const NotFound_1 = require("../Execeptions/NotFound");
const root_1 = require("../Execeptions/root");
const Unauthrized_1 = require("../Execeptions/Unauthrized");
const email_1 = require("../Services/email");
const token_1 = require("../Services/token");
const user_1 = require("../Validation/user");
const bcrypt_1 = require("bcrypt");
class ResetPassword {
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = user_1.ResetPasswordSchema.parse(req.body);
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                const user = yield ts.user.findFirst({
                    where: {
                        email: validatedData.email,
                    }
                });
                if (!user) {
                    throw new NotFound_1.NotFound("User not found", root_1.ErrorCode.USER_NOT_FOUND, null);
                }
                yield ts.resetPasswordEvnet.create({
                    data: {
                        user_id: user.id
                    }
                });
                const token = token_1.Token.generate(user.id);
                yield email_1.Email.main(validatedData.email, `http://localhost:3000/api/auth/forgetPassword/verification/${token}`)
                    .then(() => {
                    return res.status(200).json({
                        msg: "user found successfuly check your email for verification"
                    });
                })
                    .catch(() => {
                    throw new InternalException_1.InternalException("faild to send email ", root_1.ErrorCode.INTERNAL_SERVER_ERROR, null);
                });
            }));
        });
    }
    static verification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            if (!token) {
                throw new Unauthrized_1.Unauthrized("Unauthrized!", root_1.ErrorCode.UNAUTHRIZED, null);
            }
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                const token = req.params.token;
                if (!token) {
                    throw new Unauthrized_1.Unauthrized("Unauthrized!", root_1.ErrorCode.UNAUTHRIZED, null);
                }
                try {
                    const payload = token_1.Token.verify(token);
                    const resetPasswordEvent = yield ts.resetPasswordEvnet.findFirst({
                        where: {
                            user_id: payload.userId
                        }
                    });
                    if (resetPasswordEvent && !resetPasswordEvent.verification) {
                        yield ts.resetPasswordEvnet.update({
                            where: {
                                id: resetPasswordEvent === null || resetPasswordEvent === void 0 ? void 0 : resetPasswordEvent.id
                            },
                            data: {
                                verification: true
                            }
                        });
                    }
                    res.cookie("token", token);
                    return res.status(200).json({
                        msg: "email verified successfuly now you can reset your password"
                    });
                }
                catch (err) {
                    throw new Unauthrized_1.Unauthrized("Unauthrized!", root_1.ErrorCode.UNAUTHRIZED, null);
                }
            }));
        });
    }
    static updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = user_1.UpdatePasswordSchema.parse(req.body);
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                yield ts.user.update({
                    where: {
                        id: req.user.id
                    },
                    data: {
                        password: (0, bcrypt_1.hashSync)(validatedData.password, 10)
                    }
                });
                return res.status(200).json({
                    msg: "password updated successfuly"
                });
            }));
        });
    }
}
exports.ResetPassword = ResetPassword;
