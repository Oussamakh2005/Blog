import { HttpExeception } from "./root";

export class NotFound extends HttpExeception{
    constructor(message : string , errorCode : number , error : any){
        super(message,errorCode,404,error);
    }
}