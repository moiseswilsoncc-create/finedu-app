import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// 🧩 Carga de variables de entorno
dotenv.config();

// 🔍 Validación de entorno crítico
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Variables de entorno faltantes. Verifica tu archivo .env");
  process.exit(1);
}

// 🧭 Importación de rutas institucionales
import solicitudColaboradorRoutes from "./routes/solicitudColaborador.js";
import ofertasRoutes from "./routes/ofertas.js";
import aportesRoutes from "./routes/aportes.js";
import simulacionesRoutes from "./routes/simulaciones.js";
import feedbackRoutes from "./routes/feedback.js";
import actividadRoutes from "./routes/actividad.js"; // ✅ solo si actividad.js tiene `export default router`
import ingresoRoutes from "./routes/ingreso.js";
import configuracionRoutes from "./routes/configuracion.js";
import mensajesRoutes from "./routes/mensajes.js";
import resumenRoutes from "./routes/resumen.js";
import panelRoutes from "./routes/panel.js";
import visualizacionRoutes from "./routes/visualizacion.js";
import usuariosRoutes from "./routes/usuarios.js";
import loginRoutes from "./routes/login.js";
import guardarOfertaRoutes from "./routes/guardarOferta.js"; // ✅ Nueva ruta colaborador

const app = express();
const PORT = process.env.PORT || 3001;

// 🧩 Middleware institucional
app.use(cors());
app.use(bodyParser.json());

// 🚀 Activación de rutas
app.use("/api", solicitudColaboradorRoutes);
app.use("/api", ofertasRoutes);
app.use("/api", aportesRoutes);
app.use("/api", simulacionesRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", actividadRoutes);
app.use("/api", ingresoRoutes);
app.use("/api", configuracionRoutes);
app.use("/api", mensajesRoutes);
app.use("/api", resumenRoutes);
app.use("/api", panelRoutes);
app.use("/api", visualizacionRoutes);
app.use("/api", usuariosRoutes);
app.use("/api", loginRoutes);
app.use("/api", guardarOfertaRoutes); // ✅ Ruta colaborador activa

// 🧭 Ruta base para diagnóstico
app.get("/", (req, res) => {
  res.send("✅ Backend Finedu activo");
});

// 🚀 Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
});
