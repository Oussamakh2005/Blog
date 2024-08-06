import nodemailer from 'nodemailer';
import { APP_EMAIL, APP_EMAIL_PASSWORD } from '../secrets';
//transporter :
const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: APP_EMAIL,
        pass: APP_EMAIL_PASSWORD,
    },
});

export class Email {
    static async  main(email : string , link : string) {
        await transporter.sendMail({
            from : APP_EMAIL,
            to : email,
            subject : "verify account",
            html : `<p>To verify your account <a href='${link}'>click here</a>.</p>`
        });
    }
}