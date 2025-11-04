import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const VistaIngresoUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

  useEffect(() => {
    const validarSesion = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        // 🚨 Si no hay sesión activa, redirigir al login
        navigate("/login", { replace: true });
        return;
      }

      // Intentar recuperar nombre desde tabla usuarios
      const { data: usuarioExtra } = await supabase
        .from("usuarios")
        .select("nombre, apellido")
        .eq("id", data.user.id)
        .single();

      if (usuarioExtra) {
        setNombreUsuario(`${usuarioExtra.nombre} ${usuarioExtra.apellido}`);
        localStorage.setItem("nombreUsuario", `${usuarioExtra.nombre} ${usuarioExtra.apellido}`);
      } else {
        // fallback: usar correo
        setNombreUsuario(data.user.email?.split("@")[0] || "Usuario");
      }

      // Redirigir automáticamente al panel de usuario
      const timer = setTimeout(() => {
        navigate("/panel-usuario", { replace: true });
      }, 2500);

      return () => clearTimeout(timer);
    };

    validarSesion();
  }, [navigate]);

  return (
    <div
      role="status"
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "12px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ color: "#2ecc71" }}>
        🎉 ¡Registro exitoso{nombreUsuario ? `, ${nombreUsuario}` : ""}!
      </h2>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Bienvenido a <strong>Finedu</strong>, tu espacio de autonomía financiera.
      </p>
      <p style={{ marginTop: "1rem" }}>
        Desde hoy formas parte de una comunidad que transforma metas en realidad.
      </p>
      <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
        Explora, simula, aprende y avanza. Estamos contigo en cada paso.
      </p>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        Redirigiendo a tu panel personal...
      </p>
      <button
        onClick={() => navigate("/panel-usuario", { replace: true })}
        style={{
          marginTop: "1.5rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#2980b9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Ir ahora
      </button>
    </div>
  );
};

export default VistaIngresoUsuario;
