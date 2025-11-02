import express from "express";
import { markPresence } from "../controllers/presenceController.js";

const router = express.Router();

router.post("/", markPresence);

export default router;
