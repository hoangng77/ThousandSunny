import multer from "multer";
import fs from "node:fs";
import path from "node:path"

const storage = multer.diskStorage({
    // Store uploaded files in a subdirectory named with the artist ID
    destination: (req, file, cb) => {
        const artistId = req.user?._id

        if (!artistId) {
            return cb(new Error("No artist ID"), null);
        }

        const artistDir = path.join("uploads", `${artistId}`);
        console.log(artistDir);
        if (!fs.existsSync(artistDir)) {
            fs.mkdirSync(artistDir, { recursive: true });
        }
        cb(null, artistDir);
    },

    // Files are named with a timestamp and the original name
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

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