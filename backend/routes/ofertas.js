// Ruta: routes/ofertas.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Asegúrate de tener esto configurado
const crypto = require("crypto"); // Necesario para generar UUID

router.post("/guardar-oferta", async (req, res) => {
  const {
    colaborador_id,
    tipo,
    titulo,
    descripcion,
    pais,
    fecha_expiracion
  } = req.body;

  // Validación básica
  if (!colaborador_id || !tipo || !titulo || !descripcion || !pais || !fecha_expiracion) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    const nuevaOferta = {
      id: crypto.randomUUID(),
      colaborador_id,
      tipo,
      titulo,
      descripcion,
      pais,
      fecha_expiracion,
      fecha_publicacion: new Date().toISOString(),
      visible: true
    };

    const { data, error } = await supabase
      .from("ofertas_colaborador")
      .insert([nuevaOferta]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "Error al guardar la oferta." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
