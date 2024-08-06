import { Router } from "express";
import { Authintication } from "../Controllers/auth";
import { ErrorHandler } from "../Services/errorsHandler";
import { ResetPassword } from "../Controllers/reset_password";
import { Authenticated } from "../Middlewares/authiticated";

export const authRouters = Router();

//sign up :
authRouters.post('/signup',ErrorHandler.main(Authintication.signup));
//login :
authRouters.post('/login',ErrorHandler.main(Authintication.login));
//verification :
authRouters.get('/verification/:token',ErrorHandler.main(Authintication.verify));
///--Update Password--//
//forget password :
authRouters.post('/forgetPassword',ErrorHandler.main(ResetPassword.resetPassword));
//verify email for reset password :
authRouters.get('/forgetPassword/verification/:token',ErrorHandler.main(ResetPassword.verification));
//update password :
authRouters.patch('/updatePassword',Authenticated.main,ErrorHandler.main(ResetPassword.updatePassword));