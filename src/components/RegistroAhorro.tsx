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

  useEffect(() => {
    const obtenerGrupo = async () => {
      const usuarioId = localStorage.getItem("usuarioId");
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
      const usuarioId = localStorage.getItem("usuarioId");
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
  }, []);

  const grupoActivo = grupo?.estado === "activo";

  const labels = historial.map((aporte) =>
    new Date(aporte.fecha).toLocaleDateString("es-CL", {
      month: "short",
      year: "numeric",
    })
  );

  const datos = historial.map((aporte) => aporte.monto);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>📘 Registro de ahorro</h2>

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
