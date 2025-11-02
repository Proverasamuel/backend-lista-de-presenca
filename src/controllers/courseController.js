import { db } from "../config/firebase.js";

export const createCourse = async (req, res) => {
  try {
    const { universidadeId, nome, anoLectivo, delegadoId } = req.body;

    const newCourse = {
      nome,
      anoLectivo,
      delegadoId,
      criadoEm: new Date(),
    };

    const ref = db.collection("universidades").doc(universidadeId).collection("turmas");
    const doc = await ref.add(newCourse);

    res.status(201).json({ id: doc.id, ...newCourse });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar turma", error });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { universidadeId } = req.params;

    const snapshot = await db.collection("universidades").doc(universidadeId).collection("turmas").get();
    const turmas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json(turmas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar turmas", error });
  }
};
