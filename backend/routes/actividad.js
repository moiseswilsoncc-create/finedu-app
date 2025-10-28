// routes/actividad.js
import express from "express";
import supabase from "../supabaseClient.js";
import crypto from "crypto";

const actividadRoutes = express.Router();

actividadRoutes.post("/guardar-actividad", async (req, res) => {
  const { usuario_id, tipo, descripcion } = req.body;

  if (!usuario_id || !tipo || !descripcion) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
  }

  try {
    const nuevaActividad = {
      id: crypto.randomUUID(),
      usuario_id,
      tipo,
      descripcion,
      fecha: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("registro_actividad")
      .insert([nuevaActividad]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return res.status(500).json({ success: false, error: "Error al guardar la actividad." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

export default actividadRoutes;
