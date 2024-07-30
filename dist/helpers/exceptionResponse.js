"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionResponse = void 0;
const exceptionResponse = (error, req, res, next) => {
    return res.status(error.status).json({
        message: error.message,
        errorCode: error.errorCode,
        error: error.error
    });
};
exports.exceptionResponse = exceptionResponse;
