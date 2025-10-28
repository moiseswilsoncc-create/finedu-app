import express from "express";
import { supabase } from "../supabaseClient.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/finanzas-usuario", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.sub;

    const [aportes, creditos, grupo] = await Promise.all([
      supabase
        .from("aportes_grupales")
        .select("monto_mensual")
        .eq("usuario_id", usuarioId)
        .eq("activo", true)
        .single(),

      supabase
        .from("creditos_tomados")
        .select("cuota_mensual")
        .eq("usuario_id", usuarioId)
        .eq("activo", true),

      supabase
        .from("grupos_financieros")
        .select("integrantes")
        .eq("usuario_id", usuarioId)
        .single(),
    ]);

    res.status(200).json({
      ahorro: aportes.data?.monto_mensual ?? 0,
      cuotas: creditos.data?.map((c) => c.cuota_mensual) ?? [],
      integrantes: grupo.data?.integrantes ?? null,
    });
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
});

export default router;
