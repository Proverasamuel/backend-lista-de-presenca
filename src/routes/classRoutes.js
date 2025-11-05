import express from "express";
import { createClass, getAulasPorDisciplina } from "../controllers/classController.js";

const router = express.Router();

router.post("/", createClass);
router.get("/:universidadeId/:turmaId/:disciplinaId", getAulasPorDisciplina);

export default router;
