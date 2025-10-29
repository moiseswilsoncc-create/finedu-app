import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VistaIngresoUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

  useEffect(() => {
    const nombre = localStorage.getItem("nombreUsuario");
    setNombreUsuario(nombre);

    // Activar sesión y tipo de usuario
    localStorage.setItem("tipoUsuario", "usuario");
    localStorage.setItem("logueado", "true");

    // Redirigir automáticamente al panel de usuario
    const timer = setTimeout(() => {
      navigate("/usuario", { replace: true });
    }, 2500); // Espera 2.5 segundos para mostrar el mensaje

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "12px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
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
    </div>
  );
};

export default VistaIngresoUsuario;
