// Ruta: routes/ofertas.js
import express from "express";
import supabase from "../supabaseClient.js";
import crypto from "crypto";

const router = express.Router();

// ✅ Guardar nueva oferta institucional
router.post("/guardar-oferta", async (req, res) => {
  const {
    colaborador_id,
    tipo,
    titulo,
    descripcion,
    pais,
    fecha_expiracion
  } = req.body;

  // 🧩 Validación de campos obligatorios
  if (!colaborador_id || !tipo || !titulo || !descripcion || !pais || !fecha_expiracion) {
    return res.status(400).json({ success: false, error: "❌ Faltan campos obligatorios." });
  }

  try {
    const nuevaOferta = {
      id: crypto.randomUUID(),
      colaborador_id,
      tipo,
      titulo,
      descripcion,
      pais,
      fecha_expiracion: new Date(fecha_expiracion).toISOString(),
      fecha_publicacion: new Date().toISOString(),
      visible: true
    };

    const { data, error } = await supabase
      .from("ofertas_colaborador")
      .insert([nuevaOferta]);

    if (error) {
      console.error("❌ Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "❌ Error al guardar la oferta." });
    }

    console.log("✅ Oferta registrada:", data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error general:", err);
    return res.status(500).json({ success: false, error: "❌ Error interno del servidor." });
  }
});

// ✅ Eliminar automáticamente ofertas caducadas
router.delete("/eliminar-ofertas-caducadas", async (req, res) => {
  try {
    const hoy = new Date().toISOString();

    const { error } = await supabase
      .from("ofertas_colaborador")
      .delete()
      .lt("fecha_expiracion", hoy);

    if (error) {
      console.error("❌ Error al eliminar ofertas caducadas:", error);
      return res.status(500).json({ success: false });
    }

    console.log("✅ Ofertas caducadas eliminadas");
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Error interno:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
