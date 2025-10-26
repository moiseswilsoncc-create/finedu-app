// Ruta: routes/ofertas.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Asegúrate de tener esto configurado

router.post("/guardar-oferta", async (req, res) => {
  const { colaborador, tipo, titulo, descripcion, pais, fechaExpiracion } = req.body;

  // Validación básica
  if (!colaborador || !tipo || !titulo || !descripcion || !pais || !fechaExpiracion) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    const fechaPublicacion = new Date().toISOString();

    const { data, error } = await supabase
      .from("ofertas_colaborador")
      .insert([
        {
          colaborador,
          tipo,
          titulo,
          descripcion,
          pais,
          fecha_expiracion: fechaExpiracion,
          fecha_publicacion: fechaPublicacion,
          visible: true,
        },
      ]);

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
