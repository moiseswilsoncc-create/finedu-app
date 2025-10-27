// Ruta: routes/visualizacion.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const crypto = require("crypto");

router.post("/guardar-visualizacion", async (req, res) => {
  const { usuario_id, modulo } = req.body;

  if (!usuario_id || !modulo) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    // Verificar si ya existe registro previo
    const { data: existente, error: errorExistente } = await supabase
      .from("registro_visualizacion")
      .select("id")
      .eq("usuario_id", usuario_id)
      .eq("modulo", modulo)
      .single();

    if (existente) {
      // Actualizar fecha de visualización
      const { error } = await supabase
        .from("registro_visualizacion")
        .update({ fecha_vista: new Date().toISOString() })
        .eq("id", existente.id);

      if (error) throw error;
    } else {
      // Crear nuevo registro
      const { error } = await supabase
        .from("registro_visualizacion")
        .insert([{
          id: crypto.randomUUID(),
          usuario_id,
          modulo,
          fecha_vista: new Date().toISOString()
        }]);

      if (error) throw error;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error al guardar visualización:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
