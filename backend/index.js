import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Rutas institucionales
import solicitudColaboradorRoutes from "./routes/solicitudColaborador.js";
import ofertasRoutes from "./routes/ofertas.js";
import aportesRoutes from "./routes/aportes.js";
import simulacionesRoutes from "./routes/simulaciones.js";
import feedbackRoutes from "./routes/feedback.js";
import actividadRoutes from "./routes/actividad.js";
import ingresoRoutes from "./routes/ingreso.js";
import configuracionRoutes from "./routes/configuracion.js";
import mensajesRoutes from "./routes/mensajes.js";
import resumenRoutes from "./routes/resumen.js";
import panelRoutes from "./routes/panel.js";
import visualizacionRoutes from "./routes/visualizacion.js";
import usuariosRoutes from "./routes/usuarios.js"; // ✅ Registro seguro
import loginRoutes from "./routes/login.js";       // ✅ Login con verificación

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Activar rutas institucionales
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
app.use("/api", usuariosRoutes); // ✅ Registro
app.use("/api", loginRoutes);    // ✅ Login

// Ruta base
app.get("/", (req, res) => {
  res.send("✅ Backend Finedu activo");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
});
