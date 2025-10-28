// Ruta: routes/simulaciones.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const crypto = require("crypto");

router.post("/guardar-simulacion", async (req, res) => {
  const { usuario_id, tipo, resultado } = req.body;

  // Validación básica
  if (!usuario_id || !tipo || !resultado) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    const nuevaSimulacion = {
      id: crypto.randomUUID(),
      usuario_id,
      tipo,
      resultado,
      fecha: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("simulaciones")
      .insert([nuevaSimulacion]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "Error al guardar la simulación." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
