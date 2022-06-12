import express from "express";
import { MailController } from "@/controllers";

const router = express.Router();

router.post("/verification-code", (req, res) => MailController.verificationCode(res, req));
router.post("/forget-password", (req, res) => MailController.forgetPassword(res, req));

export default router;
