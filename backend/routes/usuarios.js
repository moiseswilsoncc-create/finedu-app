// Ruta: routes/usuarios.js
import express from "express";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Registrar nuevo usuario institucional
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

  // 🧩 Validación básica
  if (!correo || !nombre || !contraseña) {
    return res.status(400).json({ error: "❌ Faltan campos obligatorios." });
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
      return res.status(500).json({ error: "❌ No se pudo registrar el usuario." });
    }

    console.log("✅ Usuario registrado:", data);
    res.json({ mensaje: "✅ Usuario registrado correctamente." });
  } catch (err) {
    console.error("❌ Error en el servidor:", err);
    res.status(500).json({ error: "❌ Error interno del servidor." });
  }
});

export default router;
