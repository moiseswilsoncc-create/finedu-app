// Ruta: routes/panel.js
import express from "express";
import supabase from "../supabaseClient.js";
import crypto from "crypto";

const router = express.Router();

// ✅ Guardar panel institucional por ciudad y país
router.post("/guardar-panel", async (req, res) => {
  const {
    ciudad,
    pais,
    total_usuarios,
    total_colaboradores,
    total_aportes
  } = req.body;

  // 🧩 Validación básica
  if (!ciudad || !pais) {
    return res.status(400).json({ success: false, error: "❌ Faltan campos obligatorios." });
  }

  try {
    const nuevoPanel = {
      id: crypto.randomUUID(),
      ciudad,
      pais,
      total_usuarios: total_usuarios ?? 0,
      total_colaboradores: total_colaboradores ?? 0,
      total_aportes: total_aportes ?? 0,
      fecha: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("panel_institucional")
      .insert([nuevoPanel]);

    if (error) {
      console.error("❌ Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "❌ Error al guardar el panel institucional." });
    }

    console.log("✅ Panel institucional registrado:", data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error general:", err);
    return res.status(500).json({ success: false, error: "❌ Error interno del servidor." });
  }
});

export default router;
