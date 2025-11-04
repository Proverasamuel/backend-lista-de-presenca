import { db } from "../config/firebase.js";

import { db } from "../config/firebase.js";

export const markPresence = async (req, res) => {
  try {
    const { aulaId, alunoId, token } = req.body;

    console.log("📩 Dados recebidos do frontend:");
    console.log({ aulaId, alunoId, token });

    const aulaRef = db.collection("aulas").doc(aulaId);
    const aulaSnap = await aulaRef.get();

    if (!aulaSnap.exists) {
      console.log("❌ Aula não encontrada para o ID:", aulaId);
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    const aula = aulaSnap.data();

    console.log("📘 Dados da aula encontrada no Firestore:");
    console.log(aula);

    // valida token e expiração
    if (aula.token !== token || Date.now() > aula.expiresAt) {
      console.log("⚠️ QR inválido ou expirado:");
      console.log("Token recebido:", token);
      console.log("Token da aula:", aula.token);
      console.log("ExpiresAt:", aula.expiresAt, "-> Agora:", Date.now());
      return res.status(400).json({ message: "QR inválido ou expirado" });
    }

    // registra presença
    await aulaRef.collection("presencas").doc(alunoId).set({
      presente: true,
      hora: new Date(),
    });

    console.log("✅ Presença marcada com sucesso para aluno:", alunoId);

    res.json({ message: "Presença marcada com sucesso" });
  } catch (error) {
    console.error("🔥 Erro ao marcar presença:", error);
    res.status(500).json({ message: "Erro ao marcar presença", error: error.message });
  }
};

