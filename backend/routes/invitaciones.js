import express from "express";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const router = express.Router();

// 🔑 Cliente Supabase con service_role (solo backend)
const supabase = createClient(
  "https://TU_PROYECTO.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 📧 Configuración de correo (ejemplo con Gmail, pero ideal usar SendGrid/Resend en producción)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 📨 Endpoint para invitar colaborador
router.post("/api/invitar-colaborador", async (req, res) => {
  try {
    const { correo, institucion, rol, expira } = req.body;

    // 1. Insertar en Supabase
    const { error } = await supabase.from("ofertas_colaborador").insert([
      {
        correo,
        institucion,
        rol,
        expira,
      },
    ]);

    if (error) {
      console.error("Error Supabase:", error.message);
      return res.status(400).json({ ok: false, error: error.message });
    }

    // 2. Enviar correo
    const mailOptions = {
      from: `"Finedu" <${process.env.MAIL_USER}>`,
      to: correo,
      subject: "Invitación a unirse a Finedu",
      html: `
        <p>Estimado/a,</p>
        <p>Es un honor invitarle a formar parte de la plataforma institucional <strong>Finedu</strong>.</p>
        <p>Con esta invitación podrá registrarse como colaborador de <strong>${institucion}</strong>, accediendo a herramientas de inteligencia financiera y colaboración segura.</p>
        <p>Para completar su registro, acceda al siguiente enlace antes del <strong>${expira}</strong>:</p>
        <p><a href="https://tusitio.vercel.app/registro-colaborador?correo=${encodeURIComponent(
          correo
        )}">👉 Completar registro</a></p>
        <p>Atentamente,<br/>Equipo Finedu</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ ok: true, mensaje: "Invitación creada y correo enviado" });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ ok: false, error: "Error interno del servidor" });
  }
});

export default router;
