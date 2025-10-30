// Ruta: routes/login.js
import express from "express";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Autenticación de usuario institucional
router.post("/login-usuario", async (req, res) => {
  const { correo, contraseña } = req.body;

  // 🧩 Validación básica
  if (!correo || !contraseña) {
    return res.status(400).json({ error: "❌ Faltan campos obligatorios." });
  }

  try {
    const { data: usuarios, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correo)
      .limit(1);

    if (error || usuarios.length === 0) {
      console.warn("⚠️ Usuario no encontrado:", correo);
      return res.status(401).json({ error: "❌ Usuario no encontrado." });
    }

    const usuario = usuarios[0];
    const contraseñaValida = bcrypt.compareSync(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      console.warn("⚠️ Contraseña incorrecta para:", correo);
      return res.status(401).json({ error: "❌ Contraseña incorrecta." });
    }

    console.log("✅ Login exitoso para:", usuario.correo);
    res.json({
      mensaje: "✅ Login exitoso.",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        grupo_id: usuario.grupo_id,
        rol: usuario.rol || "usuario"
      }
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ error: "❌ Error interno del servidor." });
  }
});

export default router;
