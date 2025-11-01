import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function IngresoColaborador() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!correo || !clave) {
      setError("Completa ambos campos.");
      return;
    }

    setLoading(true);
    try {
      // 1. Hash de la clave ingresada para comparar
      const response = await fetch("/api/hash-clave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clave })
      });
      const json = await response.json();
      if (!json?.claveHasheada) {
        setError("❌ No se pudo procesar la clave.");
        setLoading(false);
        return;
      }
      const claveHasheada = json.claveHasheada;

      // 2. Buscar colaborador en la tabla
      const { data: colaborador, error: errorColaborador } = await supabase
        .from("colaboradores")
        .select("*")
        .eq("correo", correo)
        .eq("clave", claveHasheada)
        .single();

      if (errorColaborador || !colaborador) {
        setError("❌ Correo o clave incorrectos.");
        setLoading(false);
        return;
      }

      // 3. Guardar sesión mínima
      localStorage.setItem("colaborador_id", colaborador.id);
      localStorage.setItem("logueado", "true");
      localStorage.setItem("tipoUsuario", "colaborador");

      // 4. Redirigir al panel de ofertas
      navigate("/panel-colaboradores");

    } catch (err) {
      console.error("❌ Error general:", err);
      setError("Error de conexión con Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "3rem auto",
      padding: "2rem",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#3498db", marginBottom: "1rem" }}>🔑 Ingreso Colaborador</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>📧 Correo
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </label>
        <label>🔒 Clave
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{
          padding: "0.6rem",
          backgroundColor: loading ? "#95a5a6" : "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer"
        }}>
          {loading ? "Verificando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default IngresoColaborador;
