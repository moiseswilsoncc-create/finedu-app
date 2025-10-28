import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", process.env.SUPABASE_KEY || "TU_API_KEY");

router.post("/limpiar-ofertas-caducadas", async (_req, res) => {
  const hoy = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("ofertas_colaborador")
    .update({ visibilidad: false })
    .lt("fecha_expiracion", hoy)
    .eq("visibilidad", true);

  if (error) {
    console.error("❌ Error al limpiar ofertas caducadas:", error.message);
    return res.status(500).json({ error: "Error al limpiar ofertas caducadas." });
  }

  res.status(200).json({ mensaje: "✅ Ofertas caducadas ocultadas correctamente." });
});

export default router;
