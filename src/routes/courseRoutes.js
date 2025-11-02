import express from "express";
import { createCourse, getCourses } from "../controllers/courseController.js";

const router = express.Router();

router.post("/", createCourse);
router.get("/:universidadeId", getCourses);

export default router;
