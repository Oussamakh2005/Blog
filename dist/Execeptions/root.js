"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.HttpExeception = void 0;
class HttpExeception extends Error {
    constructor(message, errorCode, status, error) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.status = status;
        this.error = error;
    }
}
exports.HttpExeception = HttpExeception;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UNAUTHRIZED"] = 1001] = "UNAUTHRIZED";
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 1002] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["POST_NOT_FOUND"] = 2001] = "POST_NOT_FOUND";
    ErrorCode[ErrorCode["NO_POSTS_FOUND"] = 2002] = "NO_POSTS_FOUND";
    ErrorCode[ErrorCode["COMMENT_NOT_FOUND"] = 3001] = "COMMENT_NOT_FOUND";
    ErrorCode[ErrorCode["COMMENT_NOT_BELONG_TO_USER"] = 3002] = "COMMENT_NOT_BELONG_TO_USER";
    ErrorCode[ErrorCode["BAD_REQUEST"] = 4001] = "BAD_REQUEST";
    ErrorCode[ErrorCode["INTERNAL_SERVER_ERROR"] = 5001] = "INTERNAL_SERVER_ERROR";
    ErrorCode[ErrorCode["REPORT_NOT_FOUND"] = 6001] = "REPORT_NOT_FOUND";
    ErrorCode[ErrorCode["NO_REPORTS_FOUND"] = 6002] = "NO_REPORTS_FOUND";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
