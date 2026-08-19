import express from "express";
import { chatWithRTIAgent } from "../controller/rtiController.js";

const router = express.Router();

router.post("/chat", chatWithRTIAgent);

export default router;