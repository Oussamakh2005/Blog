import { HttpExeception } from "./root";

export class InternalException extends HttpExeception {
    constructor(message: string, errorCode: number, error: any) {
        super(message, errorCode, 500, error);
    }
}