// Archivo inicial del backend
import express from "express";
import seguridadRouter from "./routes/seguridad.js"; // 👈 importa la nueva ruta

const app = express();
app.use(express.json());

// Montar rutas de seguridad
app.use(seguridadRouter);

// ... el resto de tu configuración
