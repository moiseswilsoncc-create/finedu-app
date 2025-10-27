import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import VistaEtapa from "./VistaEtapa";

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = "TU_API_KEY"; // 🔒 Reemplazar con variable segura en producción
const supabase = createClient(supabaseUrl, supabaseKey);

type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  ingresos: number;
  egresos: number;
  grupo_id: string | null;
};

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

const Resumen: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [metaGrupal, setMetaGrupal] = useState<number>(0);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [error, setError] = useState("");

  const correoUsuario = localStorage.getItem("correo");

  useEffect(() => {
    const cargarDatos = async () => {
      if (!correoUsuario) {
        setError("No se encontró el correo del usuario en la sesión.");
        return;
      }

      const { data: usuarios, error: errorUsuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", correoUsuario)
        .single();

      if (errorUsuario || !usuarios) {
        setError("No se encontraron datos del usuario.");
        return;
      }

      setUsuario(usuarios);

      if (usuarios.grupo_id) {
        const { data: grupo, error: errorGrupo } = await supabase
          .from("grupos")
          .select("meta_grupal")
          .eq("id", usuarios.grupo_id)
          .single();

        if (!errorGrupo && grupo?.meta_grupal) {
          setMetaGrupal(grupo.meta_grupal);
        }

        const { data: miembros, error: errorMiembros } = await supabase
          .from("usuarios")
          .select("nombre, ingresos, egresos")
          .eq("grupo_id", usuarios.grupo_id);

        if (miembros) {
          setParticipantes(miembros);
        }
      }
    };

    cargarDatos();
  }, [correoUsuario]);

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#c0392b" }}>⚠️ Error</h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>{error}</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#2980b9" }}>⏳ Cargando datos...</h2>
      </div>
    );
  }

  const ahorro = usuario.ingresos - usuario.egresos;
  const cumplimiento = metaGrupal > 0 ? Math.min((ahorro / metaGrupal) * 100, 100) : 0;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        💸 Resumen de {usuario.nombre}
      </h2>

      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "1rem" }}>
        Este módulo te muestra tus ingresos, egresos y tu aporte al cumplimiento de la meta grupal.
      </p>

      <div style={{
        backgroundColor: "#ecf0f1",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "2rem"
      }}>
        <p><strong>Ingresos:</strong> ${usuario.ingresos.toLocaleString("es-CL")}</p>
        <p><strong>Egresos:</strong> ${usuario.egresos.toLocaleString("es-CL")}</p>
        <p><strong>Ahorro:</strong> ${ahorro.toLocaleString("es-CL")}</p>
        <p><strong>Cumplimiento respecto a la meta grupal:</strong> {cumplimiento.toFixed(2)}%</p>
      </div>

      {participantes.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h3>👥 Proyección colaborativa</h3>
          <VistaEtapa participantes={participantes} />
        </section>
      )}

      <p style={{ fontSize: "0.95rem", color: "#888" }}>
        Tu correo ha sido usado internamente para identificarte, pero nunca se muestra en pantalla.
      </p>
    </div>
  );
};

export default Resumen;
