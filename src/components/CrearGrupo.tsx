// 🛠️ CrearGrupo.tsx — Parte 1

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BloqueDatosGrupo from "./BloqueDatosGrupo";
import BloqueMetaFinanciera from "./BloqueMetaFinanciera";
import BloqueParticipantes from "./BloqueParticipantes";

interface Props {
  usuario: {
    correo?: string;
  };
}

const CrearGrupo: React.FC<Props> = ({ usuario }) => {
  const correoUsuario = usuario?.correo?.trim().toLowerCase() || "";

  const [nombreGrupo, setNombreGrupo] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");

  const [metaTotal, setMetaTotal] = useState<number>(0);
  const [plazoMeses, setPlazoMeses] = useState<number>(1);
  const [fechaTermino, setFechaTermino] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correos, setCorreos] = useState<string[]>([]);
  const [roles, setRoles] = useState<{ [correo: string]: "admin" | "participante" }>({});
  const [montos, setMontos] = useState<{ [correo: string]: number }>({});

  const fechaCreacion = new Date().toISOString();
  const totalIntegrantes = 1 + correos.length;
  const metaIndividual = metaTotal > 0 && totalIntegrantes > 0 ? Math.round(metaTotal / totalIntegrantes) : 0;
  const aporteMensual = metaIndividual > 0 && plazoMeses > 0 ? Math.round(metaIndividual / plazoMeses) : 0;

  useEffect(() => {
    if (!correoUsuario) return;
    const nuevosMontos: Record<string, number> = {};
    correos.forEach((correo) => {
      nuevosMontos[correo] = aporteMensual;
    });
    nuevosMontos[correoUsuario] = aporteMensual;
    setMontos(nuevosMontos);
  }, [metaTotal, plazoMeses, correos, correoUsuario]);

  const agregarCorreo = () => {
    const correoLimpio = nuevoCorreo.trim().toLowerCase();
    if (
      correoLimpio &&
      !correos.includes(correoLimpio) &&
      correoLimpio !== correoUsuario
    ) {
      setCorreos([...correos, correoLimpio]);
      setRoles({ ...roles, [correoLimpio]: "participante" });
      setNuevoCorreo("");
    }
  };

  const eliminarCorreo = (correo: string) => {
    setCorreos(correos.filter((c) => c !== correo));
    const updatedRoles = { ...roles };
    const updatedMontos = { ...montos };
    delete updatedRoles[correo];
    delete updatedMontos[correo];
    setRoles(updatedRoles);
    setMontos(updatedMontos);
  };

  const cambiarRol = (correo: string, nuevoRol: "admin" | "participante") => {
    setRoles({ ...roles, [correo]: nuevoRol });
  };

  const cambiarMonto = (correo: string, nuevoMonto: number) => {
    setMontos({ ...montos, [correo]: nuevoMonto });
  };
// 🛠️ CrearGrupo.tsx — Parte 2

  const crearGrupo = async () => {
    if (!nombreGrupo.trim() || !metaTotal || !plazoMeses || !fechaTermino) {
      alert("⚠️ Debes completar todos los campos obligatorios.");
      return;
    }

    // 1. Insertar grupo principal en grupos_ahorro
    const { data: grupoData, error: grupoError } = await supabase
      .from("grupos_ahorro")
      .insert([
        {
          nombre: nombreGrupo.trim(),
          meta_total: metaTotal,
          plazo_meses: plazoMeses,
          aporte_mensual: aporteMensual,
          fecha_inicio: new Date().toISOString(),
          fecha_fin: fechaTermino,
          administrador_id: correoUsuario,
        },
      ])
      .select()
      .single();

    if (grupoError || !grupoData) {
      alert("❌ No se pudo crear el grupo.");
      return;
    }

    const grupoId = grupoData.id;

    // 2. Insertar metadata asociada (pais, ciudad, comuna)
    const { error: metadataError } = await supabase
      .from("metadata_grupo")
      .insert([
        {
          grupo_id: grupoId,
          pais,
          ciudad,
          comuna,
        },
      ]);

    if (metadataError) {
      alert("⚠️ Grupo creado, pero hubo un error al guardar la metadata.");
      console.error(metadataError);
    }

    // 3. Insertar miembros (admin + participantes)
    const todosLosCorreos = [correoUsuario, ...correos];
    const rolesFinales = { ...roles, [correoUsuario]: "admin" };
    const montosFinales = { ...montos, [correoUsuario]: aporteMensual };

    const miembros = todosLosCorreos.map((correo) => ({
      grupo_id: grupoId,
      correo,
      rol: rolesFinales[correo] || "participante",
      monto_asignado: montosFinales[correo] || 0,
    }));

    const { error: miembrosError } = await supabase
      .from("participantes_grupo")
      .insert(miembros);

    if (miembrosError) {
      alert("❌ Error al registrar los participantes.");
      return;
    }

    alert(`✅ Grupo "${nombreGrupo}" creado exitosamente.`);
    // Reset de estados
    setNombreGrupo("");
    setPais("");
    setCiudad("");
    setComuna("");
    setMetaTotal(0);
    setPlazoMeses(1);
    setFechaTermino("");
    setCorreos([]);
    setRoles({});
    setMontos({});
  };

  if (!correoUsuario) {
    return <p>⚠️ No se puede crear grupo sin correo de usuario.</p>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🛠️ Crear nuevo grupo de ahorro</h2>

      <BloqueDatosGrupo
        nombreGrupo={nombreGrupo}
        pais={pais}
        ciudad={ciudad}
        comuna={comuna}
        setNombreGrupo={setNombreGrupo}
        setPais={setPais}
        setCiudad={setCiudad}
        setComuna={setComuna}
      />

      <BloqueMetaFinanciera
        metaTotal={metaTotal}
        plazoMeses={plazoMeses}
        metaIndividual={metaIndividual}
        aporteMensual={aporteMensual}
        setMetaTotal={setMetaTotal}
        setPlazoMeses={setPlazoMeses}
      />

      <BloqueParticipantes
  usuario={{ correo: correoUsuario }}
  correos={correos}
  montos={montos}
  nombres={nombres}
  setMontos={setMontos}
  setNombres={setNombres}
  nuevoCorreo={nuevoCorreo}
  setNuevoCorreo={setNuevoCorreo}
  agregarCorreo={agregarCorreo}
  eliminarCorreo={eliminarCorreo}
  cambiarMonto={cambiarMonto}
  crearGrupo={crearGrupo}
  aporteMensual={aporteMensual}
/>

    </div>
  );
};

export default CrearGrupo;
