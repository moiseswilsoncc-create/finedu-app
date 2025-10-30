import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import SimuladorCredito from "./SimuladorCredito";
import GraficoLinea from "./Graficos/GraficoLinea";

type Grupo = {
  id: string;
  nombre: string;
  estado: string; // "activo" o "inactivo"
  integrantes: number;
};

type Aporte = {
  fecha: string;
  monto: number;
};

function RegistroAhorro() {
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [paisUsuario, setPaisUsuario] = useState("Chile");
  const [historial, setHistorial] = useState<Aporte[]>([]);
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const usuarioId = localStorage.getItem("usuarioId");
  const grupoActivo = grupo?.estado === "activo";

  useEffect(() => {
    const obtenerGrupo = async () => {
      if (!usuarioId) return;

      const { data, error } = await supabase
        .from("grupos_financieros")
        .select("id, nombre, estado, integrantes")
        .eq("usuario_id", usuarioId)
        .single();

      if (error) {
        console.error("Error al obtener grupo:", error.message);
        return;
      }

      setGrupo(data);
    };

    const obtenerAportes = async () => {
      if (!usuarioId) return;

      const { data, error } = await supabase
        .from("aportes_usuario")
        .select("fecha, monto")
        .eq("usuario_id", usuarioId)
        .order("fecha", { ascending: true });

      if (error) {
        console.error("Error al obtener aportes:", error.message);
        return;
      }

      setHistorial(data || []);
    };

    obtenerGrupo();
    obtenerAportes();
  }, [usuarioId]);

  const registrarAporte = async () => {
    if (!usuarioId || !monto) return;

    const { error } = await supabase.from("aportes_usuario").insert([
      {
        usuario_id: usuarioId,
        monto: parseFloat(monto),
        fecha: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error("Error al registrar aporte:", error.message);
      setMensaje("❌ Error al registrar aporte.");
    } else {
      setMonto("");
      setMensaje("✅ Aporte registrado correctamente.");
      setTimeout(() => setMensaje(""), 3000);
      const { data } = await supabase
        .from("aportes_usuario")
        .select("fecha, monto")
        .eq("usuario_id", usuarioId)
        .order("fecha", { ascending: true });
      setHistorial(data || []);
    }
  };

  const labels = historial.map((aporte) =>
    new Date(aporte.fecha).toLocaleDateString("es-CL", {
      month: "short",
      year: "numeric"
    })
  );

  const datos = historial.map((aporte) => aporte.monto);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>📘 Registro de ahorro</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto a registrar"
          style={{
            flex: 1,
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={registrarAporte}
          style={{
            padding: "0.6rem 1rem",
            backgroundColor: "#2980b9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Registrar
        </button>
      </div>

      {mensaje && (
        <p style={{ color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>
      )}

      {grupoActivo && (
        <p style={{ color: "#27ae60", marginBottom: "1rem" }}>
          ✅ Tu grupo está activo. Este aporte impactará en el panel grupal.
        </p>
      )}

      {historial.length > 0 ? (
        <GraficoLinea
          titulo="Evolución de aportes mensuales"
          labels={labels}
          datos={datos}
        />
      ) : (
        <p style={{ marginTop: "1rem", color: "#888" }}>
          No hay aportes registrados aún.
        </p>
      )}

      <SimuladorCredito pais={paisUsuario} grupoActivo={grupoActivo} />
    </div>
  );
}

export default RegistroAhorro;



## 🧩 Copia técnica: RegistroAhorro.tsx

**Motivo:** El componente original genera error de build en Vercel por incompatibilidad con `react-chartjs-2`. Esta copia se conserva como referencia funcional y emocional, sin conexión activa al sistema.

**Estado:** 🟡 Desactivado temporalmente  
**Ubicación:** `docs/RegistroAhorro.tsx`  
**Impacto:** No afecta el build ni la navegación. Conserva trazabilidad para futura reactivación.
















