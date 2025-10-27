import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "TU_API_KEY"; // 🔒 Usa variable segura en producción
const supabase = createClient(supabaseUrl, supabaseKey);

router.post("/guardar-proyeccion", async (req, res) => {
  const { usuario_id, grupo_id, etapa_meses, ahorro_total, ahorro_individual } = req.body;

  // Validación básica
  if (!usuario_id || !etapa_meses || ahorro_total === undefined || ahorro_individual === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const { data, error } = await supabase.from("proyecciones_grupales").insert([
      {
        usuario_id,
        grupo_id,
        etapa_meses,
        ahorro_total,
        ahorro_individual,
      },
    ]);

    if (error) {
      console.error("❌ Error al guardar proyección:", error);
      return res.status(500).json({ error: "Error al guardar proyección." });
    }

    return res.status(200).json({ mensaje: "✅ Proyección guardada correctamente", data });
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return res.status(500).json({ error: "Error inesperado en el servidor." });
  }
});

export default router;
