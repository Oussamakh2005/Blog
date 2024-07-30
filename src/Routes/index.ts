import { Router } from "express";
import { authRouters } from "./auth";
import { postRouter } from "./post";
import { reportRouter } from "./report";

export const rootRouter = Router();
//auth :
rootRouter.use('/auth',authRouters);
//post :
rootRouter.use('/post',postRouter);
//report :
rootRouter.use('/report',reportRouter);