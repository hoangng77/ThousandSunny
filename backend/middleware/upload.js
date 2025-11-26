import multer from "multer";
import fs from "node:fs";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
        console.log(file.mimetype);
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Unsupported file type"), false);
        }
        cb(null, true);
    },
});
export default upload;