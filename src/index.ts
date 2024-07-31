import express from "express";
import { PORT } from "./secrets";
import { PrismaClient } from "@prisma/client";
import { rootRouter } from "./Routes";
import cookieParser from "cookie-parser";
import { exceptionResponse } from "./helpers/exceptionResponse";
import cors from "cors";
//set up app :
const app = express();
//prisma client :
export const prisma = new PrismaClient({
    log: ['query']
});
//set cookie parser :
app.use(cookieParser());
//express json :
app.use(express.json());
//cors :
app.use(cors());
//Routes : 
app.use('/api', rootRouter);
//access to uploades images :
app.use('/api/uploads', express.static(__dirname + '/uploads'));
//Exceptions response : 
app.use(exceptionResponse);
//set port to app :
app.listen(PORT, () => {
    console.log(`server started successfuly listen to PORT : ${PORT}`);
});

