import { db } from "../config/firebase.js";

export const markPresence = async (req, res) => {
  try {
    const { universidadeId, turmaId, disciplinaId, aulaId, alunoId, token } = req.body;

    const aulaRef = db
      .collection("universidades")
      .doc(universidadeId)
      .collection("turmas")
      .doc(turmaId)
      .collection("disciplinas")
      .doc(disciplinaId)
      .collection("aulas")
      .doc(aulaId);

    const aulaSnap = await aulaRef.get();
    if (!aulaSnap.exists) return res.status(404).json({ message: "Aula não encontrada" });

    const aula = aulaSnap.data();
    if (aula.token !== token || Date.now() > aula.expiresAt)
      return res.status(400).json({ message: "QR inválido ou expirado" });

    await aulaRef.collection("presencas").doc(alunoId).set({
      presente: true,
      hora: new Date(),
    });

    res.json({ message: "Presença marcada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao marcar presença", error });
  }
};
