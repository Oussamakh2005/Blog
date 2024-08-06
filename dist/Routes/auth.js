"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouters = void 0;
const express_1 = require("express");
const auth_1 = require("../Controllers/auth");
const errorsHandler_1 = require("../Services/errorsHandler");
const reset_password_1 = require("../Controllers/reset_password");
const authiticated_1 = require("../Middlewares/authiticated");
exports.authRouters = (0, express_1.Router)();
//sign up :
exports.authRouters.post('/signup', errorsHandler_1.ErrorHandler.main(auth_1.Authintication.signup));
//login :
exports.authRouters.post('/login', errorsHandler_1.ErrorHandler.main(auth_1.Authintication.login));
//verification :
exports.authRouters.get('/verification/:token', errorsHandler_1.ErrorHandler.main(auth_1.Authintication.verify));
///--Update Password--//
//forget password :
exports.authRouters.post('/forgetPassword', errorsHandler_1.ErrorHandler.main(reset_password_1.ResetPassword.resetPassword));
//verify email for reset password :
exports.authRouters.get('/forgetPassword/verification/:token', errorsHandler_1.ErrorHandler.main(reset_password_1.ResetPassword.verification));
//update password :
exports.authRouters.patch('/updatePassword', authiticated_1.Authenticated.main, errorsHandler_1.ErrorHandler.main(reset_password_1.ResetPassword.updatePassword));
