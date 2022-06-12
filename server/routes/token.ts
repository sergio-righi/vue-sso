import express from "express";
import { TokenController } from "@/controllers";

const router = express.Router();

router.post("/", (req, res) => TokenController.create(req, res));
router.get("/", (req, res) => TokenController.find(req, res));
router.put("/", (req, res) => TokenController.update(req, res));
router.patch("/done/:id", (req, res) => TokenController.done(req, res));
router.patch("/undone/:id", (req, res) => TokenController.undone(req, res));
router.patch("/reset/:id", (req, res) => TokenController.reset(req, res));

export default router;
