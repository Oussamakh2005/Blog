"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouters = void 0;
const express_1 = require("express");
const auth_1 = require("../Controllers/auth");
const errorsHandler_1 = require("../Services/errorsHandler");
exports.authRouters = (0, express_1.Router)();
//sign up :
exports.authRouters.post('/signup', errorsHandler_1.ErrorHandler.main(auth_1.Authintication.signup));
//login :
exports.authRouters.post('/login', errorsHandler_1.ErrorHandler.main(auth_1.Authintication.login));
//verification :
exports.authRouters.get('/verification/:token', errorsHandler_1.ErrorHandler.main(auth_1.Authintication.verify));
