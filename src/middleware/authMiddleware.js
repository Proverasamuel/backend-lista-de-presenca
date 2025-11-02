import { auth } from "../firebase.js";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido", error: error.message });
  }
};

// ✅ middleware para verificar role
export const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !rolesPermitidos.includes(userRole)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  };
};
