import { NextFunction, Response } from "express";
import { Token } from "../Services/token";
import { prisma } from "..";
import { Unauthrized } from "../Execeptions/Unauthrized";
import { ErrorCode } from "../Execeptions/root";
export class Authenticated {
   static async main(req: any, res: Response, next: NextFunction) {
      const token = req.cookies.token;
      if (!token) {
         next(new Unauthrized("Unauthrized", ErrorCode.UNAUTHRIZED, null));
      }
     
      try {
         const payload = Token.verify(token);
         const user = await prisma.user.findFirst({
            where: {
               id: payload.userId
            }
         });
         req.user = user;
         next();
      } catch (err) {
         next(new Unauthrized("Unauthrized", ErrorCode.UNAUTHRIZED, null));
      };
   }
}