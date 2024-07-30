"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const root_1 = require("../Execeptions/root");
const zod_1 = require("zod");
const BadRequest_1 = require("../Execeptions/BadRequest");
const InternalException_1 = require("../Execeptions/InternalException");
class ErrorHandler {
    static main(method) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield method(req, res, next);
            }
            catch (err) {
                let exception;
                if (err instanceof root_1.HttpExeception) {
                    exception = err;
                }
                else if (err instanceof zod_1.ZodError) {
                    exception = new BadRequest_1.BadRequest("Bad request(Wrong information)", root_1.ErrorCode.BAD_REQUEST, err);
                }
                else {
                    exception = new InternalException_1.InternalException("Somthing went wrong", root_1.ErrorCode.INTERNAL_SERVER_ERROR, null);
                }
                next(exception);
            }
        });
    }
}
exports.ErrorHandler = ErrorHandler;
