import { HttpExeception } from "./root";

export class Unauthrized extends HttpExeception {
    constructor(message: string, errorCode: number, error: any) {
        super(message, errorCode, 401, error);
    }
}