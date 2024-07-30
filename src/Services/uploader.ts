import multer from "multer";
import path from "path";
import { v4 as uuidV4 } from "uuid";
import fs from "fs";

const uploadDirectory = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
} 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, uuidV4() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: (req : any, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            req.fileValidatorError = "Invalid file type, only images are allowed!";
           cb(null,false);
        }
    },
    limits : {
        fileSize : 1024 * 1024 * 2 //2MB
    },
});