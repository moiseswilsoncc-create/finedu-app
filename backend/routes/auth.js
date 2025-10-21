import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const usuariosPath = path.resolve("backend/data/usuarios.json");

router.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
  const usuario = usuarios.find((u) => u.correo === correo && u.contraseña === contraseña);
  res.json({ success: !!usuario, usuario });
});

router.post("/recuperar-clave", (req, res) => {
  const { correo } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
  const existe = usuarios.some((u) => u.correo === correo);
  res.json({ success: existe, token: existe ? "abc123" : null });
});

router.post("/nueva-clave", (req, res) => {
  const { token, correo, nuevaClave } = req.body;
  if (token !== "abc123") return res.json({ success: false });
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
  const index = usuarios.findIndex((u) => u.correo === correo);
  if (index !== -1) {
    usuarios[index].contraseña = nuevaClave;
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

export default router;
