const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

router.post("/limpiar-tokens-vencidos", async (req, res) => {
  const ahora = new Date().toISOString();

  const { error } = await supabase
    .from("tokens_activacion")
    .delete()
    .lt("fecha_expiracion", ahora)
    .eq("usado", false);

  if (error) {
    console.error("❌ Error al limpiar tokens vencidos:", error.message);
    return res.status(500).json({ error: "Error al limpiar tokens." });
  }

  res.status(200).json({ mensaje: "✅ Tokens vencidos eliminados correctamente." });
});

module.exports = router;
