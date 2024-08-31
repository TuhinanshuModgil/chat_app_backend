import express from "express";
import { login, logout, sendMailVerfication, signup } from "../controllers/auth.controller.js";
import verifyEmail  from '../middleware/verifyingInstituteEmail.js'
const router = express.Router();

router.post("/signup",verifyEmail,  signup);
router.post("/email-verification", sendMailVerfication);

router.post("/login", login);

router.post("/logout", logout);
; // New route for email verification


export default router;
