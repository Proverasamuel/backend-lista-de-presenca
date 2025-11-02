import express from "express";
import { createUser, loginUser, getUsers } from "../controllers/userController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
// Protegido — só admin pode listar usuários
router.get("/", verifyToken, checkRole(["admin"]), getUsers);



export default router;
