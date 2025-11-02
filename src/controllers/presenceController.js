import { db } from "../config/firebase.js";

export const markPresence = async (req, res) => {
  try {
    const { aulaId, alunoId, token } = req.body;

    // Verifica aula
    const aulaDoc = await db.collection("aulas").doc(aulaId).get();
    if (!aulaDoc.exists) return res.status(404).json({ message: "Aula não encontrada" });

    const aula = aulaDoc.data();

    // Verifica token e expiração
    if (aula.token !== token || Date.now() > aula.expiresAt)
      return res.status(400).json({ message: "QR Code inválido ou expirado" });

    // Marca presença
    await db.collection("aulas").doc(aulaId).collection("presencas").doc(alunoId).set({
      presente: true,
      hora: new Date(),
    });

    res.json({ message: "Presença marcada com sucesso" });
  } catch (error) {
    console.error("Erro ao marcar presença:", error);
    res.status(500).json({ message: "Erro ao marcar presença" });
  }
};
