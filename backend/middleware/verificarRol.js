// backend/middleware/verificarRol.js
import { supabase } from "../supabaseClient.js";
import jwt from "jsonwebtoken";

// Middleware institucional para proteger rutas por tipo de usuario
export const verificarRol = (rolPermitido) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuarioId = decoded.sub;

      const { data, error } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id", usuarioId)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      if (data.tipo_usuario !== rolPermitido) {
        return res.status(403).json({ error: "Acceso denegado por tipo de usuario." });
      }

      req.usuarioId = usuarioId;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido o expirado." });
    }
  };
};
