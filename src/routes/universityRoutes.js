import express from "express";
import { createUniversity, getUniversities } from "../controllers/universityController.js";

const router = express.Router();

router.post("/", createUniversity);
router.get("/", getUniversities);

export default router;
