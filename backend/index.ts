// backend/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import guardarOferta from "./routes/guardarOferta";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 🧩 Middleware institucional
app.use(cors());
app.use(express.json());

// ✅ Ruta para guardar ofertas de colaboradores
app.use("/api", guardarOferta);

// 🚀 Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});
