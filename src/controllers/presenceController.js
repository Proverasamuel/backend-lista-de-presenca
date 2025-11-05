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

    console.log("📥 A buscar presenças de:", { universidadeId, turmaId, disciplinaId, aulaId });

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
      console.log("📭 Nenhuma presença encontrada para esta aula.");
      return res.status(404).json({ message: "Nenhuma presença encontrada" });
    }

    // Obter lista de presenças com dados do aluno
    const presencas = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const alunoId = doc.id;

        // Busca os dados do aluno (ajusta o nome da coleção se for diferente)
        const alunoDoc = await db.collection("users").doc(alunoId).get();
        const alunoData = alunoDoc.exists ? alunoDoc.data() : {};

        return {
          alunoId,
          ...data,
          aluno: {
            nome: alunoData.nome || "Desconhecido",
            email: alunoData.email || "—",
            numeroEstudante: alunoData.numeroEstudante || null,
          },
        };
      })
    );

    console.log("📋 Presenças encontradas:", presencas.length);
    res.json(presencas);
  } catch (error) {
    console.error("🔥 Erro ao buscar presenças:", error);
    res.status(500).json({ message: "Erro ao buscar presenças", error: error.message });
  }
};




export const getPresencasPorDisciplinaEData = async (req, res) => {
  try {
    const { universidadeId, turmaId, disciplinaId } = req.params;
    const { data } = req.query; // formato YYYY-MM-DD

    const aulasRef = db
      .collection("universidades")
      .doc(universidadeId)
      .collection("turmas")
      .doc(turmaId)
      .collection("disciplinas")
      .doc(disciplinaId)
      .collection("aulas");

    // 🔎 Buscar aulas da data indicada
    const snapshot = await aulasRef.get();
    let presencas = [];

    snapshot.forEach(async (aulaDoc) => {
      const aulaData = aulaDoc.data();
      const dataAula = new Date(aulaData.dataHora).toISOString().split("T")[0];
      if (dataAula === data) {
        const presencasRef = aulaDoc.ref.collection("presencas");
        const presencasSnap = await presencasRef.get();
        presencasSnap.forEach((p) =>
          presencas.push({ id: p.id, ...p.data(), aulaId: aulaDoc.id })
        );
      }
    });

    res.json(presencas);
  } catch (error) {
    console.error("Erro ao buscar presenças:", error);
    res.status(500).json({ message: "Erro ao buscar presenças", error: error.message });
  }
};
