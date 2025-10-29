// Ruta: routes/ingreso.js
import express from "express";
import supabase from "../supabaseClient.js";
import crypto from "crypto";

const router = express.Router();

// ✅ Registrar ingreso del usuario
router.post("/guardar-ingreso", async (req, res) => {
  const { usuario_id, ip, dispositivo } = req.body;

  // 🧩 Validación básica
  if (!usuario_id || !ip || !dispositivo) {
    return res.status(400).json({ success: false, error: "❌ Faltan campos obligatorios." });
  }

  try {
    const nuevoIngreso = {
      id: crypto.randomUUID(),
      usuario_id,
      ip,
      dispositivo,
      fecha: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("registro_ingreso")
      .insert([nuevoIngreso]);

    if (error) {
      console.error("❌ Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "❌ Error al guardar el ingreso." });
    }

    console.log("✅ Ingreso registrado:", data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error general:", err);
    return res.status(500).json({ success: false, error: "❌ Error interno del servidor." });
  }
});

export default router;
