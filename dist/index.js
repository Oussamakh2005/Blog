"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const client_1 = require("@prisma/client");
const Routes_1 = require("./Routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const exceptionResponse_1 = require("./helpers/exceptionResponse");
const cors_1 = __importDefault(require("cors"));
//set up app :
const app = (0, express_1.default)();
//prisma client :
exports.prisma = new client_1.PrismaClient({
    log: ['query']
});
//set cookie parser :
app.use((0, cookie_parser_1.default)());
//express json :
app.use(express_1.default.json());
//cors :
app.use((0, cors_1.default)());
//Routes : 
app.use('/api', Routes_1.rootRouter);
//access to uploades images :
app.use('/api/uploads', express_1.default.static(__dirname + '/uploads'));
//Exceptions response : 
app.use(exceptionResponse_1.exceptionResponse);
//set port to app :
app.listen(secrets_1.PORT, () => {
    console.log(`server started successfuly listen to PORT : ${secrets_1.PORT}`);
});
