import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", process.env.SUPABASE_KEY || "TU_API_KEY");

router.post("/guardar-oferta", async (req, res) => {
  const { tipo, titulo, descripcion, pais, fecha_expiracion, colaborador } = req.body;

  if (!tipo || !titulo || !descripcion || !pais || !fecha_expiracion || !colaborador) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const { data, error } = await supabase.from("ofertas_colaborador").insert([
    {
      tipo,
      titulo,
      descripcion,
      pais,
      fecha_expiracion,
      colaborador,
      fecha_publicacion: new Date().toISOString(),
      visibilidad: true,
    },
  ]);

  if (error) {
    return res.status(500).json({ error: "Error al guardar la oferta." });
  }

  return res.status(200).json({ mensaje: "✅ Oferta guardada correctamente", data });
});

export default router;
