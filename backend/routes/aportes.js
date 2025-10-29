// Ruta: routes/aportes.js
import express from "express";
import supabase from "../supabaseClient.js";
import crypto from "crypto";

const router = express.Router();

// ✅ Guardar nuevo aporte colaborador
router.post("/guardar-aporte", async (req, res) => {
  const { usuario_id, grupo_id, monto } = req.body;

  // 🧩 Validación básica
  if (!usuario_id || !monto) {
    return res.status(400).json({ success: false, error: "❌ Faltan campos obligatorios." });
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
      console.error("❌ Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "❌ Error al guardar el aporte." });
    }

    console.log("✅ Aporte registrado:", data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error general:", err);
    return res.status(500).json({ success: false, error: "❌ Error interno del servidor." });
  }
});

export default router;
