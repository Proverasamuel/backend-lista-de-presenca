import { db } from "../config/firebase.js";
import QRCode from "qrcode";
import crypto from "crypto";

export const createClass = async (req, res) => {
  try {
    const { turmaId, disciplinaId, dataHora, duracao, localizacao } = req.body;

    // Token temporário para o QR code (expira após 5 min)
    const token = crypto.randomBytes(8).toString("hex");
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const newClass = {
      turmaId,
      disciplinaId,
      dataHora,
      duracao,
      localizacao,
      token,
      expiresAt,
      createdAt: new Date(),
    };

    const docRef = await db.collection("aulas").add(newClass);

    // Gera QR code com o token
    const qrData = { token, aulaId: docRef.id };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    res.status(201).json({ id: docRef.id, qrCode, ...newClass });
  } catch (error) {
    console.error("Erro ao criar aula:", error);
    res.status(500).json({ message: "Erro ao criar aula" });
  }
};
