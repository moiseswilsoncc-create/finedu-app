// Ruta: routes/mensajes.js
import express from "express";
import supabase from "../supabaseClient.js";
import crypto from "crypto";

const router = express.Router();

// ✅ Guardar mensaje del sistema para el usuario
router.post("/guardar-mensaje", async (req, res) => {
  const { usuario_id, titulo, contenido } = req.body;

  // 🧩 Validación básica
  if (!usuario_id || !titulo || !contenido) {
    return res.status(400).json({ success: false, error: "❌ Faltan campos obligatorios." });
  }

  try {
    const nuevoMensaje = {
      id: crypto.randomUUID(),
      usuario_id,
      titulo,
      contenido,
      fecha_envio: new Date().toISOString(),
      leido: false
    };

    const { data, error } = await supabase
      .from("mensajes_sistema")
      .insert([nuevoMensaje]);

    if (error) {
      console.error("❌ Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "❌ Error al guardar el mensaje." });
    }

    console.log("✅ Mensaje registrado:", data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error general:", err);
    return res.status(500).json({ success: false, error: "❌ Error interno del servidor." });
  }
});

export default router;
