import { db } from "../config/firebase.js";

// Criar universidade
export const createUniversity = async (req, res) => {
  try {
    const { nome, sigla } = req.body;

    const newUni = {
      nome,
      sigla,
      criadoEm: new Date(),
    };

    const docRef = await db.collection("universidades").add(newUni);
    res.status(201).json({ id: docRef.id, ...newUni });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar universidade", error });
  }
};

// Listar universidades
export const getUniversities = async (req, res) => {
  try {
    const snapshot = await db.collection("universidades").get();
    const universidades = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(universidades);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar universidades", error });
  }
};
