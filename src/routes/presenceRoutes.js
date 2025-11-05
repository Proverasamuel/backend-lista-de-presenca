import express from "express";
import { markPresence,getPresencasByAula } from "../controllers/presenceController.js";

const router = express.Router();

router.post("/", markPresence);
router.get("/classes/:universidadeId/:turmaId/:disciplinaId/:aulaId/presencas", getPresencasByAula);

export default router;
