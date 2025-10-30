// Ruta: routes/guardarOferta.js
import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Guardar oferta institucional desde colaborador
router.post("/guardar-oferta", async (req, res) => {
  const {
    tipo,
    titulo,
    descripcion,
    ciudad,
    pais,
    fecha_expiracion,
    colaborador
  } = req.body;

  console.log("📨 Oferta recibida:", req.body);

  // 🧩 Validación básica
  if (
    !tipo ||
    !titulo ||
    !descripcion ||
    !ciudad ||
    !pais ||
    !fecha_expiracion ||
    !colaborador
  ) {
    console.warn("⚠️ Datos incompletos");
    return res.status(400).json({ error: "❌ Todos los campos son obligatorios" });
  }

  try {
    const { data, error } = await supabase
      .from("ofertas_colaborador")
      .insert([
        {
          tipo,
          titulo,
          descripcion,
          ciudad,
          pais,
          fecha_expiracion,
          colaborador
        }
      ]);

    if (error) {
      console.error("❌ Error al guardar en Supabase:", error);
      return res.status(500).json({ error: "❌ Error al guardar la oferta" });
    }

    console.log("✅ Oferta guardada:", data);
    res.status(200).json({ mensaje: "✅ Oferta registrada correctamente", data });
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    res.status(500).json({ error: "❌ Error inesperado" });
  }
});

export default router;
