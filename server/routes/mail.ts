import express from "express";
import { MailController } from "@/controllers";

const router = express.Router();

router.post("/verification-code", (req, res) => MailController.verificationCode(req, res));
router.post("/forget-password", (req, res) => MailController.forgetPassword(req, res));

export default router;
