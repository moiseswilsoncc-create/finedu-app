// Ruta: routes/aportes.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const crypto = require("crypto");

router.post("/guardar-aporte", async (req, res) => {
  const { usuario_id, grupo_id, monto } = req.body;

  // Validación básica
  if (!usuario_id || !monto) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    const nuevoAporte = {
      id: crypto.randomUUID(),
      usuario_id,
      grupo_id: grupo_id || null,
      monto,
      fecha: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("aportes")
      .insert([nuevoAporte]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "Error al guardar el aporte." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
