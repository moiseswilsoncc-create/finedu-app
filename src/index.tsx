import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import guardarOferta from "./routes/guardarOferta";

// 🧩 Carga de variables de entorno
dotenv.config();

// 🔍 Validación de entorno crítico
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Variables de entorno faltantes. Verifica tu archivo .env");
  process.exit(1);
}

console.log("🔍 Variables cargadas correctamente");

// 🚀 Inicialización del servidor Express
const app = express();
const PORT = process.env.PORT || 4000;

// 🧩 Middleware institucional
app.use(cors());
app.use(express.json());

// ✅ Ruta para guardar ofertas de colaboradores
app.use("/api", guardarOferta);

// 🧭 Ruta base para diagnóstico
app.get("/", (_, res) => {
  res.send("✅ Backend Finedu operativo");
});

// 🚀 Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});
