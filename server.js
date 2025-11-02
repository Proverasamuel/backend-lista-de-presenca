import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());
server.use("/api", app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
