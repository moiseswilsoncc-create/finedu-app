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
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");
  const [pais, setPais] = useState("");
  const [meta, setMeta] = useState<number>(0);
  const [meses, setMeses] = useState<number>(1);
  const [fechaTermino, setFechaTermino] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correos, setCorreos] = useState<string[]>([]);
  const [roles, setRoles] = useState<{ [correo: string]: "admin" | "participante" }>({});
  const [montos, setMontos] = useState<{ [correo: string]: number }>({});

  const fechaCreacion = new Date().toISOString();
  const totalIntegrantes = 1 + correos.length;
  const metaIndividual = meta > 0 && totalIntegrantes > 0 ? Math.round(meta / totalIntegrantes) : 0;
  const cuotaMensual = metaIndividual > 0 && meses > 0 ? Math.round(metaIndividual / meses) : 0;

  useEffect(() => {
    if (!correoUsuario) return;
    const nuevosMontos: any = {};
    correos.forEach((correo) => {
      nuevosMontos[correo] = cuotaMensual;
    });
    nuevosMontos[correoUsuario] = cuotaMensual;
    setMontos(nuevosMontos);
  }, [meta, meses, correos, correoUsuario]);

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

  const crearGrupo = async () => {
    if (!nombreGrupo.trim() || !meta || !meses || !fechaTermino) {
      alert("⚠️ Debes completar todos los campos obligatorios.");
      return;
    }

    const todosLosCorreos = [correoUsuario, ...correos];
    const rolesFinales = { ...roles, [correoUsuario]: "admin" };
    const montosFinales = { ...montos, [correoUsuario]: cuotaMensual };

    const { data: usuariosValidos, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("correo")
      .in("correo", todosLosCorreos);

    if (errorUsuarios) {
      alert("❌ Error al validar usuarios.");
      return;
    }

    const registrados = usuariosValidos.map((u) => u.correo);
    const faltantes = todosLosCorreos.filter((c) => !registrados.includes(c));
    if (faltantes.length > 0) {
      alert(`⚠️ Los siguientes correos no están registrados:\n${faltantes.join("\n")}`);
      return;
    }

    const { data: grupoData, error: grupoError } = await supabase
      .from("grupos_ahorro")
      .insert([
        {
          nombre: nombreGrupo.trim(),
          ciudad,
          comuna,
          pais,
          meta,
          meses,
          monto_mensual: cuotaMensual,
          fecha_creacion: fechaCreacion,
          fecha_termino: fechaTermino,
          administrador: correoUsuario,
        },
      ])
      .select();

    if (grupoError || !grupoData) {
      alert("❌ No se pudo crear el grupo.");
      return;
    }

    const grupoId = grupoData[0].id;
    const miembros = todosLosCorreos.map((correo) => ({
      grupo_id: grupoId,
      correo,
      rol: rolesFinales[correo],
      monto_asignado: montosFinales[correo],
    }));

    const { error: miembrosError } = await supabase
      .from("miembros_grupo")
      .insert(miembros);

    if (miembrosError) {
      alert("❌ Error al registrar los participantes.");
      return;
    }

    alert(`✅ Grupo "${nombreGrupo}" creado exitosamente.`);
    setNombreGrupo("");
    setCiudad("");
    setComuna("");
    setPais("");
    setMeta(0);
    setMeses(1);
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
        ciudad={ciudad}
        comuna={comuna}
        pais={pais}
        fechaTermino={fechaTermino}
        setNombreGrupo={setNombreGrupo}
        setCiudad={setCiudad}
        setComuna={setComuna}
        setPais={setPais}
        setFechaTermino={setFechaTermino}
      />

      <BloqueMetaFinanciera
        meta={meta}
        meses={meses}
        metaIndividual={metaIndividual}
        cuotaMensual={cuotaMensual}
        setMeta={setMeta}
        setMeses={setMeses}
      />

      <BloqueParticipantes
        usuario={{ correo: correoUsuario }}
        correos={correos}
        roles={roles}
        cuotaMensual={cuotaMensual}
        nuevoCorreo={nuevoCorreo}
        agregarCorreo={agregarCorreo}
        eliminarCorreo={eliminarCorreo}
        cambiarRol={cambiarRol}
        setNuevoCorreo={setNuevoCorreo}
        crearGrupo={crearGrupo}
      />
    </div>
  );
};

export default CrearGrupo;
