import { Router } from "express";
import bcrypt from "bcrypt";

const router = Router();

// Endpoint para hashear clave
router.post("/api/hash-clave", async (req, res) => {
  try {
    const { clave } = req.body;
    if (!clave) return res.status(400).json({ error: "Clave requerida" });

    const saltRounds = 12;
    const hash = await bcrypt.hash(clave, saltRounds);

    res.json({ claveHasheada: hash });
  } catch (err) {
    console.error("❌ Error al hashear:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Endpoint para verificar clave
router.post("/api/verificar-clave", async (req, res) => {
  try {
    const { clavePlano, claveHasheada } = req.body;
    if (!clavePlano || !claveHasheada) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const ok = await bcrypt.compare(clavePlano, claveHasheada);
    res.json({ valida: ok });
  } catch (err) {
    console.error("❌ Error al verificar:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;

