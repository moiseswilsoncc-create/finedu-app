import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

router.delete("/eliminar-ofertas-caducadas", async (req, res) => {
  const hoy = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("ofertas_colaborador")
    .delete()
    .lt("fecha_expiracion", hoy);

  if (error) {
    console.error("❌ Error al eliminar ofertas caducadas:", error);
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(200).json({ success: true, mensaje: "✅ Ofertas caducadas eliminadas correctamente." });
});

export default router;
