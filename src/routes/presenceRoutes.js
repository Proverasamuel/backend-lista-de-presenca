import express from "express";
import { markPresence,getPresencasByAula } from "../controllers/presenceController.js";

const router = express.Router();

router.post("/", markPresence);
router.get("/:universidadeId/:turmaId/:disciplinaId", getPresencasPorDisciplinaEData);

router.get("/:universidadeId/:turmaId/:disciplinaId/:aulaId", getPresencasByAula); // lista presenças

export default router;
