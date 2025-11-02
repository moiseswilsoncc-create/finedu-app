import express from "express";
import dotenv from "dotenv";
import seguridadRouter from "./utils/seguridad";

dotenv.config();
const app = express();
app.use(express.json());

// Montar rutas de seguridad
app.use(seguridadRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Servidor backend escuchando en puerto ${port}`);
});

