// Ruta: routes/solicitudColaborador.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Asegúrate de tener esto configurado

router.post("/solicitud-colaborador", async (req, res) => {
  const {
    nombre,
    apellido,
    rol,
    area,
    institucion,
    pais,
    ciudad,
    contrasena,
  } = req.body;

  // Validación básica
  if (
    !nombre || !apellido || !rol || !area ||
    !institucion || !pais || !ciudad || !contrasena
  ) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    const fechaSolicitud = new Date().toISOString();

    const { data, error } = await supabase
      .from("solicitudes_colaborador")
      .insert([
        {
          nombre,
          apellido,
          rol,
          area,
          institucion,
          pais,
          ciudad,
          contrasena,
          fecha_solicitud: fechaSolicitud,
          estado: "pendiente"
        }
      ]);

    if (error) {
      console.error("Error al guardar solicitud:", error);
      return res.status(500).json({ success: false, error: "Error al registrar la solicitud." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
