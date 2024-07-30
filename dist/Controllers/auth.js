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
exports.Authintication = void 0;
const user_1 = require("../Validation/user");
const __1 = require("..");
const token_1 = require("../Services/token");
const email_1 = require("../Services/email");
const Unauthrized_1 = require("../Execeptions/Unauthrized");
const BadRequest_1 = require("../Execeptions/BadRequest");
const root_1 = require("../Execeptions/root");
const bcrypt_1 = require("bcrypt");
class Authintication {
    static signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = user_1.NewUserSchema.parse(req.body);
            return yield __1.prisma.$transaction(($ts) => __awaiter(this, void 0, void 0, function* () {
                const user = yield $ts.user.findFirst({
                    where: {
                        email: validatedData.email
                    }
                });
                if (user) {
                    return res.status(400).json({ message: "Email already exist" });
                }
                else {
                    const newUser = yield $ts.user.create({
                        data: {
                            name: validatedData.name,
                            email: validatedData.email,
                            password: (0, bcrypt_1.hashSync)(validatedData.password, 10),
                        }
                    });
                    //Generate token :
                    const token = token_1.Token.generate(newUser.id);
                    //Send verification email :
                    yield email_1.Email.main(validatedData.email, token)
                        .then(() => {
                        console.log("email sent.");
                        return res.status(201).json({
                            msg: "you have registered successfully check your email for verification."
                        });
                    }).catch((error) => __awaiter(this, void 0, void 0, function* () {
                        yield $ts.user.delete({
                            where: {
                                id: newUser.id
                            }
                        });
                        console.log("faild to sent email.");
                        console.error(error);
                        return res.status(500).json({ message: "Failed to send verification email." });
                    }));
                }
            }));
        });
    }
    static verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            if (!token) {
                throw new Unauthrized_1.Unauthrized("Unauthrized!", root_1.ErrorCode.UNAUTHRIZED, null);
            }
            return yield __1.prisma.$transaction(($ts) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const payload = token_1.Token.verify(token);
                    const user = yield $ts.user.findFirst({
                        where: {
                            id: payload.userId
                        }
                    });
                    if (user === null || user === void 0 ? void 0 : user.verfication) {
                        res.cookie("token", token);
                        return res.status(200).json({ message: "Logged in (Account already verified)" });
                    }
                    yield $ts.user.update({
                        where: {
                            id: payload.userId
                        },
                        data: {
                            verfication: true
                        }
                    });
                    res.cookie("token", token);
                    return res.status(200).json({ message: "Logged in (Account verified)" });
                }
                catch (err) {
                    throw new Unauthrized_1.Unauthrized("Unauthrized!", root_1.ErrorCode.UNAUTHRIZED, null);
                }
            }));
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = user_1.LoginSchema.parse(req.body);
            const user = yield __1.prisma.user.findFirst({
                where: {
                    email: validatedData.email
                }
            });
            if (!user) {
                throw new BadRequest_1.BadRequest("Bad request(Wrong information)", root_1.ErrorCode.BAD_REQUEST, null);
            }
            if (!(0, bcrypt_1.compareSync)(validatedData.password, user.password)) {
                throw new BadRequest_1.BadRequest("Bad request(Wrong information)", root_1.ErrorCode.BAD_REQUEST, null);
            }
            else if (!user.verfication) {
                //Generate token :
                const token = token_1.Token.generate(user.id);
                yield email_1.Email.main(user.email, token);
                return res.status(400).json({ message: "your account is not verified please verify if first check your Email" });
            }
            else {
                //Generate token :
                const token = token_1.Token.generate(user.id);
                res.cookie("token", token);
                return res.status(200).json({ message: "Logged in" });
            }
        });
    }
}
exports.Authintication = Authintication;
