import express from "express";
import { registerUser, loginUser } from "../controllers/authControllers/loginAndRegister.js";
import { resetPassword, forgetPassword } from "../controllers/authControllers/passwordRecovery.js";

const router = express.Router();

router.post("register", registerUser);
router.post("login", loginUser);
router.post("forget-password", forgetPassword);
router.post("reset-password/:token", resetPassword);

export default router;