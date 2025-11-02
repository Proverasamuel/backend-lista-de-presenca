import { db } from "../config/firebase.js";
import QRCode from "qrcode";
import crypto from "crypto";

export const createClass = async (req, res) => {
  try {
    const { universidadeId, turmaId, disciplinaId, dataHora, duracao, localizacao } = req.body;

    const token = crypto.randomBytes(8).toString("hex");
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const newClass = {
      dataHora,
      duracao,
      localizacao,
      token,
      expiresAt,
      criadoEm: new Date(),
    };

    const ref = db
      .collection("universidades")
      .doc(universidadeId)
      .collection("turmas")
      .doc(turmaId)
      .collection("disciplinas")
      .doc(disciplinaId)
      .collection("aulas");

    const doc = await ref.add(newClass);

    const qrData = { token, aulaId: doc.id };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    res.status(201).json({ id: doc.id, qrCode, ...newClass });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar aula", error });
  }
};
