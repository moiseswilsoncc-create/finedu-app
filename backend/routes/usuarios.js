const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post("/registrar-usuario", async (req, res) => {
  const {
    nombre,
    apellido,
    fechaNacimiento,
    sexo,
    pais,
    ciudad,
    comuna,
    correo,
    contraseña,
    grupo_id,
    created_at
  } = req.body;

  if (!correo || !nombre || !contraseña) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const hash = bcrypt.hashSync(contraseña, 10);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{
        nombre,
        apellido,
        fechaNacimiento,
        sexo,
        pais,
        ciudad,
        comuna,
        correo,
        contraseña: hash,
        grupo_id,
        created_at
      }]);

    if (error) {
      console.error("❌ Error al guardar en Supabase:", error);
      return res.status(500).json({ error: "No se pudo registrar el usuario." });
    }

    res.json({ mensaje: "✅ Usuario registrado correctamente." });
  } catch (err) {
    console.error("❌ Error en el servidor:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
