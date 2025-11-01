// Archivo inicial del backend
import express from "express";
import seguridadRouter from "./routes/seguridad.js"; // 👈 importa la nueva ruta

const app = express();
app.use(express.json());

// Montar rutas de seguridad
app.use(seguridadRouter);

// Aquí puedes montar otras rutas existentes
// import otrasRutas from "./routes/otras.js";
// app.use(otrasRutas);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`);
});
