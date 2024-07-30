import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpExeception } from "../Execeptions/root";
import { ZodError } from "zod";
import { BadRequest } from "../Execeptions/BadRequest";
import { InternalException } from "../Execeptions/InternalException";

export class ErrorHandler {
    static main(method: Function) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
              await  method(req, res, next);
            } catch (err : any) {
                let exception : HttpExeception;
                if(err instanceof HttpExeception){
                    exception = err;
                }else if(err instanceof ZodError){
                    exception = new BadRequest("Bad request(Wrong information)",ErrorCode.BAD_REQUEST,err);
                }else{
                    exception = new InternalException("Somthing went wrong",ErrorCode.INTERNAL_SERVER_ERROR,null);
                }
                next(exception);
            }
        }
    }
}