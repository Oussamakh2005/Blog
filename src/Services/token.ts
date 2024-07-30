import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../secrets";
export class Token{
 /**
 * this function will generate and return a token
 * with the given user id and secret key 
 */
    static generate(userId: number): string {
        const token = jwt.sign({
            userId: userId,
        },
            JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        return token;
    }
    static verify(token: string): any {
        return jwt.verify(token, JWT_SECRET_KEY);
    }
}
