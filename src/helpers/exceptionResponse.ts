import { NextFunction, Request , Response } from "express";
import { HttpExeception } from "../Execeptions/root";

export const exceptionResponse = ( error : HttpExeception, req : Request,res : Response ,next : NextFunction ) =>  {
   return res.status(error.status ).json({
        message: error.message,
        errorCode: error.errorCode,
        error: error.error
    });
}