import express from "express";
import { createDiscipline, getDisciplines } from "../controllers/disciplineController.js";

const router = express.Router();

router.post("/", createDiscipline);
router.get("/:universidadeId/:turmaId", getDisciplines);

export default router;
