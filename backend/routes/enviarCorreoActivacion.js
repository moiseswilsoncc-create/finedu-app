const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

// Configura tu transporte institucional
const transporter = nodemailer.createTransport({
  service: "gmail", // o SMTP institucional
  auth: {
    user: "finedu.activacion@gmail.com",
    pass: "TU_CONTRASEÑA_SEGURA"
  }
});

router.post("/enviar-correo-activacion", async (req, res) => {
  const { correo, rol } = req.body;

  if (!correo || !rol) {
    return res.status(400).json({ error: "Faltan datos requeridos." });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const fechaExpiracion = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from("tokens_activacion").insert([
    {
      correo,
      rol,
      token,
      fecha_expiracion: fechaExpiracion
    }
  ]);

  if (insertError) {
    console.error("❌ Error al guardar token:", insertError.message);
    return res.status(500).json({ error: "Error al generar token." });
  }

  const enlace = `https://finedu-app.vercel.app/activar?token=${token}`;

  const mailOptions = {
    from: '"Finedu Activación" <finedu.activacion@gmail.com>',
    to: correo,
    subject: "Activación de cuenta Finedu",
    html: `
      <h2>Bienvenido a Finedu 👋</h2>
      <p>Has sido invitado como <strong>${rol}</strong> a la plataforma institucional de Finedu.</p>
      <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <p><a href="${enlace}">${enlace}</a></p>
      <p>Este enlace expirará en 48 horas.</p>
      <hr />
      <p style="font-size: 0.9rem; color: #888;">Finedu · Plataforma de Inteligencia Financiera para LATAM</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensaje: "✅ Correo de activación enviado correctamente." });
  } catch (mailError) {
    console.error("❌ Error al enviar correo:", mailError.message);
    res.status(500).json({ error: "Error al enviar el correo." });
  }
});

module.exports = router;
