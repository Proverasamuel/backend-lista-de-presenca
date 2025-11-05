import { db } from "../config/firebase.js";

export const markPresence = async (req, res) => {
  try {
    const { aulaId, alunoId, token, universidadeId, turmaId, disciplinaId } = req.body;

    console.log("📩 Dados recebidos do frontend:");
    console.log({ aulaId, alunoId, token, universidadeId, turmaId, disciplinaId });

    // 🔒 Valida IDs e token
    if (!aulaId || !alunoId || !token || !universidadeId || !turmaId || !disciplinaId) {
      console.log("❌ IDs ou token inválidos");
      return res.status(400).json({ message: "IDs ou token inválidos" });
    }

    // 🔗 Referência correta para a aula
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

    if (!aulaSnap.exists) {
      console.log("❌ Aula não encontrada para o ID:", aulaId);
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    const aula = aulaSnap.data();
    console.log("📘 Dados da aula encontrada no Firestore:", aula);

    // 🔑 Valida token e expiração
    if (aula.token !== token || Date.now() > aula.expiresAt) {
      console.log("⚠️ QR inválido ou expirado");
      console.log("Token recebido:", token);
      console.log("Token da aula:", aula.token);
      console.log("ExpiresAt:", aula.expiresAt, "-> Agora:", Date.now());
      return res.status(400).json({ message: "QR inválido ou expirado" });
    }

    // ✅ Registra presença
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

export const getPresencasByAula = async (req, res) => {
  try {
    const { universidadeId, turmaId, disciplinaId, aulaId } = req.params;

    console.log("📋 Buscando presenças da aula:", { universidadeId, turmaId, disciplinaId, aulaId });

    const presencasRef = db
      .collection("universidades")
      .doc(universidadeId)
      .collection("turmas")
      .doc(turmaId)
      .collection("disciplinas")
      .doc(disciplinaId)
      .collection("aulas")
      .doc(aulaId)
      .collection("presencas");

    const snapshot = await presencasRef.get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const presencas = [];

    for (const doc of snapshot.docs) {
      const presenca = doc.data();
      const alunoId = doc.id;

      // 🔍 Busca dados do aluno
      const alunoSnap = await db.collection("users").doc(alunoId).get();
      const aluno = alunoSnap.exists ? alunoSnap.data() : { nome: "Aluno desconhecido" };

      presencas.push({
        alunoId,
        nome: aluno.name,
        email: aluno.email,
        presente: presenca.presente,
        hora: presenca.hora,
      });
    }

    res.json(presencas);
  } catch (error) {
    console.error("🔥 Erro ao buscar presenças:", error);
    res.status(500).json({ message: "Erro ao buscar presenças", error: error.message });
  }
};

