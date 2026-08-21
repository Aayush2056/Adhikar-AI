import express from "express";
import { chatWithSchemeAgent } from "../controller/schemeController.js";

const router = express.Router();

router.post("/chat", chatWithSchemeAgent);

export default router;