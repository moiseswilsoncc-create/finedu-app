// Ruta: routes/configuracion.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const crypto = require("crypto");

router.post("/guardar-configuracion", async (req, res) => {
  const { usuario_id, idioma, notificaciones, vista_simplificada } = req.body;

  // Validación básica
  if (!usuario_id) {
    return res.status(400).json({ success: false, error: "Falta el ID del usuario." });
  }

  try {
    // Verificar si ya existe configuración previa
    const { data: existente, error: errorExistente } = await supabase
      .from("configuracion_usuario")
      .select("id")
      .eq("usuario_id", usuario_id)
      .single();

    if (errorExistente && errorExistente.code !== "PGRST116") {
      throw errorExistente;
    }

    let resultado;
    if (existente) {
      // Actualizar configuración existente
      const { data, error } = await supabase
        .from("configuracion_usuario")
        .update({
          idioma,
          notificaciones,
          vista_simplificada,
          fecha: new Date().toISOString()
        })
        .eq("usuario_id", usuario_id);

      if (error) throw error;
      resultado = data;
    } else {
      // Crear nueva configuración
      const { data, error } = await supabase
        .from("configuracion_usuario")
        .insert([{
          id: crypto.randomUUID(),
          usuario_id,
          idioma: idioma || "es",
          notificaciones: notificaciones ?? true,
          vista_simplificada: vista_simplificada ?? false,
          fecha: new Date().toISOString()
        }]);

      if (error) throw error;
      resultado = data;
    }

    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    console.error("Error al guardar configuración:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
