import express, { query } from "express";
import { PORT } from "./secrets";
import { PrismaClient } from "@prisma/client";
import { rootRouter } from "./Routes";
import cookieParser from "cookie-parser";
import { exceptionResponse } from "./helpers/exceptionResponse";
//set up app :
const app = express();
//prisma client :
export const prisma = new PrismaClient({
    log: ['query']
});
//ser cookie parser :
app.use(cookieParser());
//express json :
app.use(express.json());
//Routes : 
app.use('/api', rootRouter);
//Exceptions response : 
app.use(exceptionResponse);
//set port to app :
app.listen(PORT, () => {
    console.log(`server started successfuly listen to PORT : ${PORT}`);
});

