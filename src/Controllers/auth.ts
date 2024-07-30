import { NextFunction, Request, Response } from "express";
import { LoginSchema, NewUserSchema } from "../Validation/user";
import { prisma } from "..";
import { Token } from "../Services/token";
import { Email } from "../Services/email";
import { Unauthrized  } from "../Execeptions/Unauthrized";
import { BadRequest } from "../Execeptions/BadRequest";
import { ErrorCode} from "../Execeptions/root";
import {hashSync,compareSync} from "bcrypt"

export class Authintication {
    static async signup(req: Request, res: Response,next : NextFunction) {
        const validatedData = NewUserSchema.parse(req.body);
        return await prisma.$transaction(async ($ts) => {
            const user = await $ts.user.findFirst({
                where: {
                    email: validatedData.email
                }
            });
            if (user) {
                return res.status(400).json({ message: "Email already exist" });
            } else {
                const newUser = await $ts.user.create({
                    data : {
                        name : validatedData.name,
                        email : validatedData.email,
                        password :hashSync(validatedData.password,10),
                    }
                });
                //Generate token :
                const token = Token.generate(newUser.id);
                //Send verification email :
                await Email.main(validatedData.email, token)
                    .then(() => {
                        console.log("email sent.");
                        return res.status(201).json({
                            msg: "you have registered successfully check your email for verification."
                        });
                    }).catch(async (error) => {
                        await $ts.user.delete({
                            where: {
                                id: newUser.id
                            }
                        });
                        console.log("faild to sent email.");
                        console.error(error);
                        return res.status(500).json({ message: "Failed to send verification email." });
                    });
            }
        });
    }
    static async verify(req: Request, res: Response ) {
        const token = req.params.token;
        if (!token) {
            throw new Unauthrized("Unauthrized!",ErrorCode.UNAUTHRIZED,null);
        }
       
        return await prisma.$transaction(async ($ts) => {
            try {
                const payload = Token.verify(token);
                const user = await $ts.user.findFirst({
                    where: {
                        id: payload.userId
                    }
                });
                if (user?.verfication) {
                    res.cookie("token", token);
                    return res.status(200).json({ message: "Logged in (Account already verified)" });
                }
                await $ts.user.update({
                    where: {
                        id: payload.userId
                    },
                    data: {
                        verfication: true
                    }
                });
                res.cookie("token", token);
                return res.status(200).json({ message: "Logged in (Account verified)" });
            } catch (err) {
                throw new Unauthrized("Unauthrized!",ErrorCode.UNAUTHRIZED,null);
            }
        });
    }
    static async login(req: Request, res: Response) {
        const validatedData = LoginSchema.parse(req.body)
            const user  = await prisma.user.findFirst({
                where: {
                    email: validatedData.email
                }
            });
            if(!user){
                throw new BadRequest("Bad request(Wrong information)",ErrorCode.BAD_REQUEST,null);
            }
            if (!compareSync(validatedData.password, user.password)) {
                throw new BadRequest("Bad request(Wrong information)",ErrorCode.BAD_REQUEST,null);
            } else if (!user.verfication) {
                //Generate token :
                const token = Token.generate(user.id);
                await Email.main(user.email, token);
                return res.status(400).json({ message: "your account is not verified please verify if first check your Email" });
            }else {
                 //Generate token :
                 const token = Token.generate(user.id);
                res.cookie("token", token);
                return res.status(200).json({ message: "Logged in"});
            }
    }
}