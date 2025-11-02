import { auth, db } from "../config/firebase.js";

// ✅ Middleware para validar o token JWT do Firebase
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    // Verifica e decodifica o token do Firebase
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido", error: error.message });
  }
};

// ✅ Middleware para verificar roles personalizadas
export const checkRole = (rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ message: "Usuário não autenticado" });

      // Buscar o papel do usuário no Firestore
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists) return res.status(404).json({ message: "Usuário não encontrado" });

      const { role } = userDoc.data();

      if (!rolesPermitidos.includes(role)) {
        return res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
      }

      // Anexa role ao req.user para uso posterior
      req.user.role = role;

      next();
    } catch (error) {
      return res.status(500).json({ message: "Erro ao verificar permissões", error: error.message });
    }
  };
};
