import dotenv from 'dotenv';

dotenv.config();

//variables :
export const PORT = process.env.PORT;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

export const APP_EMAIL = process.env.APP_EMAIL;
export const APP_EMAIL_PASSWORD = process.env.APP_EMAIL_PASSWORD;