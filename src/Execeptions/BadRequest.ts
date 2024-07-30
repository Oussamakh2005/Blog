import { HttpExeception } from "./root";

export class BadRequest extends HttpExeception {
    constructor(message: string, errorCode: number, error: any) {
        super(message, errorCode, 400, error);
    }
}