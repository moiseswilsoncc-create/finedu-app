// backend/routes/validarRol.js
import express from "express";
import { supabase } from "../supabaseClient.js"; // Asegúrate de tener la conexión configurada
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware institucional para validar rol de usuario
router.post("/validar-rol", async (req, res) => {
  const { token, tipoSolicitado } = req.body;

  if (!token || !tipoSolicitado) {
    return res.status(400).json({ error: "Faltan datos para validar el rol." });
  }

  try {
    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.sub;

    // Consultar tipo de usuario en Supabase
    const { data, error } = await supabase
      .from("usuarios")
      .select("tipo_usuario")
      .eq("id", usuarioId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const tipoRegistrado = data.tipo_usuario;

    // Validar coincidencia
    if (tipoRegistrado !== tipoSolicitado) {
      return res.status(403).json({
        error: "Acceso denegado. El tipo de usuario no coincide.",
        tipoRegistrado,
        tipoSolicitado,
      });
    }

    return res.status(200).json({ acceso: "permitido", tipo: tipoRegistrado });
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
});

export default router;
