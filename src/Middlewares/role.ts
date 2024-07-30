import { NextFunction,Response } from "express";
import { Unauthrized } from "../Execeptions/Unauthrized";
import { ErrorCode } from "../Execeptions/root";
export class Role  {
    static async adminModerator(req: any, res: Response, next: NextFunction) { 
        if(req.user.role == "ADMIN" || req.user.role == "MODERATOR"){
            next();
        } else{
            next(new Unauthrized("Unauthrized (you are not admin or moderator)",ErrorCode.UNAUTHRIZED,null))
        }
    }

    static async admin(req: any, res: Response, next: NextFunction) { 
        if(req.user.role === "ADMIN"){
            next();
        }else{
            next(new Unauthrized("Unauthrized",ErrorCode.UNAUTHRIZED,null));
        }
    }
 }