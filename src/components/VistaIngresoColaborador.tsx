import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = "TU_API_KEY"; // 🔒 Reemplazar con variable segura
const supabase = createClient(supabaseUrl, supabaseKey);

const VistaIngresoColaborador: React.FC = () => {
  const navigate = useNavigate();
  const [estadoAcceso, setEstadoAcceso] = useState<"pendiente" | "autorizado" | "no-autorizado">("pendiente");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    const validarRol = async () => {
      const correoLocal = localStorage.getItem("correo");
      if (!correoLocal) {
        setEstadoAcceso("pendiente");
        return;
      }

      setCorreo(correoLocal);

      const { data, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("correo", correoLocal)
        .single();

      if (data?.rol === "colaborador") {
        setEstadoAcceso("autorizado");
      } else {
        setEstadoAcceso("no-autorizado");
      }
    };

    validarRol();
  }, []);

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
      <h2 style={{ color: "#3498db" }}>👥 Acceso exclusivo para colaboradores</h2>

      {estadoAcceso === "pendiente" && (
        <>
          <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
            Este portal es solo para colaboradores autorizados por Finedu.
          </p>
          <p style={{ marginTop: "1rem" }}>
            Si ya recibiste tu correo de activación con tu clave personal, puedes iniciar sesión.
          </p>
          <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
            Si aún no tienes acceso, primero debes enviar tu correo institucional a Finedu para recibir autorización.
          </p>
        </>
      )}

      {estadoAcceso === "autorizado" && (
        <>
          <p style={{ marginTop: "1rem", color: "#2ecc71" }}>
            ✅ Tu correo institucional está autorizado como colaborador.
          </p>
          <button
            onClick={() => navigate("/login-colaborador")}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.2rem",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            🔐 Iniciar sesión como colaborador
          </button>
        </>
      )}

      {estadoAcceso === "no-autorizado" && (
        <>
          <p style={{ marginTop: "1rem", color: "#e74c3c" }}>
            ⚠️ Tu correo <strong>{correo}</strong> no está autorizado como colaborador.
          </p>
          <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
            Si crees que esto es un error, contacta a Finedu para solicitar acceso institucional.
          </p>
        </>
      )}
    </div>
  );
};

export default VistaIngresoColaborador;
