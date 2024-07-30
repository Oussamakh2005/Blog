export class HttpExeception extends Error {
    message: string;
    errorCode : ErrorCode;
    status : number;
    error : any;
    constructor(message : string , errorCode : ErrorCode , status : number, error : any){
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.status = status;
        this.error = error;
    }
}

export enum ErrorCode{
    UNAUTHRIZED=1001,
    USER_NOT_FOUND=1002,
    POST_NOT_FOUND=2001,
    NO_POSTS_FOUND=2002,
    COMMENT_NOT_FOUND=3001,
    COMMENT_NOT_BELONG_TO_USER=3002,
    BAD_REQUEST= 4001,
    INTERNAL_SERVER_ERROR=5001,
    REPORT_NOT_FOUND=6001,
    NO_REPORTS_FOUND=6002
}