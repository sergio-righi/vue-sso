import express from "express";
import { TokenController } from "@/controllers";

const router = express.Router();

router.post("/", (req, res) => TokenController.create(req, res));
router.get("/", (req, res) => TokenController.find(req, res));
router.patch("/grant/:id", (req, res) => TokenController.grant(req, res));
router.patch("/revoke/:id", (req, res) => TokenController.revoke(req, res));
router.patch("/reset/:id", (req, res) => TokenController.reset(req, res));

export default router;
