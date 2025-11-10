import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import VistaEtapa from "./VistaEtapa";
import VistaGrupal from "./VistaGrupal";

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

interface Props {
  usuario: {
    correo: string;
  };
}

const Resumen: React.FC<Props> = ({ usuario }) => {
  const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);
  const [metaGrupal, setMetaGrupal] = useState<number>(0);
  const [nombreGrupo, setNombreGrupo] = useState<string>("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const correoUsuario = usuario?.correo;

  useEffect(() => {
    const cargarDatos = async () => {
      if (!correoUsuario) {
        setError("⚠️ No se encontró el correo del usuario en la sesión.");
        setCargando(false);
        return;
      }

      const { data: usuarios, error: errorUsuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", correoUsuario)
        .single();

      if (errorUsuario || !usuarios) {
        setError("❌ No se encontraron datos del usuario.");
        setCargando(false);
        return;
      }

      setUsuarioData(usuarios);

      if (usuarios.grupo_id) {
        const { data: grupo } = await supabase
          .from("grupos")
          .select("meta_grupal, nombre")
          .eq("id", usuarios.grupo_id)
          .single();

        if (grupo) {
          setMetaGrupal(grupo.meta_grupal);
          setNombreGrupo(grupo.nombre);
        }

        const { data: miembros } = await supabase
          .from("usuarios")
          .select("nombre, ingresos, egresos")
          .eq("grupo_id", usuarios.grupo_id);

        if (miembros) {
          setParticipantes(miembros);
        }
      }

      setCargando(false);
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

  if (cargando || !usuarioData) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#2980b9" }}>⏳ Cargando datos...</h2>
      </div>
    );
  }

  const ahorro = usuarioData.ingresos - usuarioData.egresos;
  const cumplimiento =
    metaGrupal > 0 ? Math.min((ahorro / metaGrupal) * 100, 100) : 0;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        💸 Resumen de {usuarioData.nombre}
      </h2>

      <div
        style={{
          backgroundColor: "#ecf0f1",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "2rem",
        }}
      >
        <p>
          <strong>Ingresos:</strong>{" "}
          ${usuarioData.ingresos.toLocaleString("es-CL")}
        </p>
        <p>
          <strong>Egresos:</strong>{" "}
          ${usuarioData.egresos.toLocaleString("es-CL")}
        </p>
        <p>
          <strong>Ahorro:</strong> ${ahorro.toLocaleString("es-CL")}
        </p>
        <p>
          <strong>Cumplimiento respecto a la meta grupal:</strong>{" "}
          {cumplimiento.toFixed(2)}%
        </p>
      </div>

      {participantes.length > 0 && (
        <>
          <VistaEtapa participantes={participantes} />
          <VistaGrupal
            nombreGrupoMeta={nombreGrupo}
            metaGrupal={metaGrupal}
            participantes={participantes}
          />
        </>
      )}

      <p
        style={{
          fontSize: "0.95rem",
          color: "#888",
          marginTop: "2rem",
        }}
      >
        Tu correo ha sido usado internamente para identificarte, pero nunca se
        muestra en pantalla.
      </p>
    </div>
  );
};

export default Resumen;
