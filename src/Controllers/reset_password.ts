import { prisma } from "..";
import { Response } from "express";
import { InternalException } from "../Execeptions/InternalException";
import { NotFound } from "../Execeptions/NotFound";
import { ErrorCode } from "../Execeptions/root";
import { Unauthrized } from "../Execeptions/Unauthrized";
import { Email } from "../Services/email";
import { Token } from "../Services/token";
import { ResetPasswordSchema, UpdatePasswordSchema } from "../Validation/user";
import { hashSync } from "bcrypt";

export class ResetPassword {
    static async resetPassword(req: any, res: Response) {
        const validatedData = ResetPasswordSchema.parse(req.body);
        return await prisma.$transaction(async (ts) => {
            const user = await ts.user.findFirst({
                where: {
                    email: validatedData.email,
                }
            });
            if (!user) {
                throw new NotFound("User not found", ErrorCode.USER_NOT_FOUND, null);
            }
            await ts.resetPasswordEvnet.create({
                data: {
                    user_id: user.id
                }
            });

            const token = Token.generate(user.id);
            await Email.main(validatedData.email, `http://localhost:3000/api/auth/forgetPassword/verification/${token}`)
                .then(() => {
                    return res.status(200).json({
                        msg: "user found successfuly check your email for verification"
                    });
                })
                .catch(() => {
                    throw new InternalException("faild to send email ", ErrorCode.INTERNAL_SERVER_ERROR, null);
                })

        });
    }

    static async verification(req: any, res: Response) {
        const token = req.params.token;
        if (!token) {
            throw new Unauthrized("Unauthrized!", ErrorCode.UNAUTHRIZED, null);
        }

        return await prisma.$transaction(async (ts) => {
            const token = req.params.token;
            if (!token) {
                throw new Unauthrized("Unauthrized!",ErrorCode.UNAUTHRIZED,null);
            }
            try {
                const payload = Token.verify(token);
                const resetPasswordEvent = await ts.resetPasswordEvnet.findFirst({
                    where: {
                        user_id: payload.userId
                    }
                });
                if(resetPasswordEvent && !resetPasswordEvent.verification){
                    await ts.resetPasswordEvnet.update({
                        where : {
                            id : resetPasswordEvent?.id 
                        },
                        data : {
                            verification : true
                        }
                    })
                }
                res.cookie("token",token);
                return res.status(200).json({
                    msg : "email verified successfuly now you can reset your password"
                });
            }catch(err){
                throw new Unauthrized("Unauthrized!", ErrorCode.UNAUTHRIZED, null);
            } 
        });
    }
    static async updatePassword (req : any ,res : Response) {
        const validatedData = UpdatePasswordSchema.parse(req.body);
        return await prisma.$transaction(async(ts)=>{
            await ts.user.update({
                where  : {
                    id : req.user.id
                },
                data : {
                    password : hashSync(validatedData.password,10)
                }
            })
            return res.status(200).json({
                msg : "password updated successfuly"
            })
        });
    }
}