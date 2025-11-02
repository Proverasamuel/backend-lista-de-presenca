import { db } from "../config/firebase.js";

export const createDiscipline = async (req, res) => {
  try {
    const { universidadeId, turmaId, nome, professor } = req.body;

    const newDisc = { nome, professor, criadoEm: new Date() };

    const ref = db
      .collection("universidades")
      .doc(universidadeId)
      .collection("turmas")
      .doc(turmaId)
      .collection("disciplinas");

    const doc = await ref.add(newDisc);

    res.status(201).json({ id: doc.id, ...newDisc });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar disciplina", error });
  }
};

export const getDisciplines = async (req, res) => {
  try {
    const { universidadeId, turmaId } = req.params;
    const ref = db
      .collection("universidades")
      .doc(universidadeId)
      .collection("turmas")
      .doc(turmaId)
      .collection("disciplinas");

    const snapshot = await ref.get();
    const disciplinas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar disciplinas", error });
  }
};
