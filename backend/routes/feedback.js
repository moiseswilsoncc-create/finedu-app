// Ruta: routes/feedback.js
import express from "express";
import supabase from "../supabaseClient.js";
import crypto from "crypto";

const router = express.Router();

router.post("/guardar-feedback", async (req, res) => {
  const { usuario_id, tipo, mensaje } = req.body;

  // Validación básica
  if (!usuario_id || !tipo || !mensaje) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    const nuevoFeedback = {
      id: crypto.randomUUID(),
      usuario_id,
      tipo,
      mensaje,
      fecha: new Date().toISOString(),
      respondido: false
    };

    const { data, error } = await supabase
      .from("feedback_usuario")
      .insert([nuevoFeedback]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "Error al guardar el feedback." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

export default router;
