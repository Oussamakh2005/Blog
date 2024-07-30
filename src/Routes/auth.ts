import { Router } from "express";
import { Authintication } from "../Controllers/auth";
import { ErrorHandler } from "../Services/errorsHandler";

export const authRouters = Router();

//sign up :
authRouters.post('/signup',ErrorHandler.main(Authintication.signup));
//login :
authRouters.post('/login',ErrorHandler.main(Authintication.login));
//verification :
authRouters.get('/verification/:token',ErrorHandler.main(Authintication.verify));