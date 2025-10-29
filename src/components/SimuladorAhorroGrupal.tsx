import React, { useState, useEffect } from "react";
import { formatearMoneda } from "../utils/formatearMoneda";
import { supabase } from "../supabaseClient";

type Props = {
  pais: string;
};

const SimuladorAhorroGrupal: React.FC<Props> = ({ pais }) => {
  const [metaTotal, setMetaTotal] = useState(10000000);
  const [plazoMeses, setPlazoMeses] = useState(12);
  const [integrantes, setIntegrantes] = useState<number | null>(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) return;

    const obtenerIntegrantes = async () => {
      const { data } = await supabase
        .from("usuarios_grupo")
        .select("cantidad")
        .eq("usuario_id", usuarioId)
        .single();

      if (data) setIntegrantes(data.cantidad);
    };

    obtenerIntegrantes();
  }, []);

  const aporteMensualPorPersona =
    integrantes && integrantes > 0
      ? metaTotal / integrantes / plazoMeses
      : 0;

  const registrarSimulacionGrupal = async () => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId || !integrantes) return;

    const { error } = await supabase.from("simulaciones").insert([
      {
        usuario: usuarioId,
        tipo: "ahorro_grupal",
        pais,
        meta_total: metaTotal,
        plazo_meses: plazoMeses,
        integrantes,
        aporte_mensual_por_persona: aporteMensualPorPersona,
        fecha: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error("❌ Error al registrar simulación grupal:", error.message);
    } else {
      console.log("✅ Simulación grupal registrada en Supabase");
    }

    await supabase.from("registro_actividad").insert([
      {
        usuario: usuarioId,
        modulo: "SimuladorAhorroGrupal",
        accion: "Simulación ejecutada",
        fecha: new Date().toISOString()
      }
    ]);
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "700px",
      margin: "2rem auto",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        🤝 Simulador de ahorro grupal ({pais})
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        <label>
          Meta total del grupo:
          <input
            type="number"
            value={metaTotal}
            onChange={(e) => setMetaTotal(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Plazo en meses:
          <input
            type="number"
            value={plazoMeses}
            onChange={(e) => setPlazoMeses(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
      </div>

      <ul style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
        <li>Integrantes activos del grupo: {integrantes ?? "Cargando..."}</li>
        <li>
          <strong>Aporte mensual por persona:</strong>{" "}
          {formatearMoneda(aporteMensualPorPersona, pais)}
        </li>
        <li>
          <strong>Meta total:</strong> {formatearMoneda(metaTotal, pais)}
        </li>
      </ul>

      <button
        onClick={registrarSimulacionGrupal}
        style={{
          marginTop: "1.5rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#9b59b6",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        📥 Guardar simulación grupal
      </button>
    </div>
  );
};

export default SimuladorAhorroGrupal;

