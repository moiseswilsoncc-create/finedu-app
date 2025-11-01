import { Router } from "express";
import bcrypt from "bcrypt";

const router = Router();

// Endpoint para generar hash de una clave
router.post("/api/hash-clave", async (req, res) => {
  try {
    const { clave } = req.body;
    if (!clave) {
      return res.status(400).json({ error: "Falta la clave" });
    }
    const hash = await bcrypt.hash(clave, 10);
    res.json({ hash });
  } catch (error) {
    res.status(500).json({ error: "Error al generar hash" });
  }
});

// Endpoint para verificar una clave contra un hash
router.post("/api/verificar-clave", async (req, res) => {
  try {
    const { clave, hash } = req.body;
    if (!clave || !hash) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    const esValida = await bcrypt.compare(clave, hash);
    res.json({ valido: esValida });
  } catch (error) {
    res.status(500).json({ error: "Error al verificar clave" });
  }
});

export default router;
