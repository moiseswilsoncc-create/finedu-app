// Ruta: routes/resumen.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const crypto = require("crypto");

router.post("/guardar-resumen", async (req, res) => {
  const { usuario_id, total_creditos, total_ahorro, total_inversion } = req.body;

  // Validación básica
  if (!usuario_id) {
    return res.status(400).json({ success: false, error: "Falta el ID del usuario." });
  }

  try {
    const nuevoResumen = {
      id: crypto.randomUUID(),
      usuario_id,
      total_creditos: total_creditos ?? 0,
      total_ahorro: total_ahorro ?? 0,
      total_inversion: total_inversion ?? 0,
      fecha: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("resumen_financiero")
      .insert([nuevoResumen]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "Error al guardar el resumen." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
