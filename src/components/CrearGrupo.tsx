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

  // Datos generales
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");

  // Meta financiera
  const [metaTotal, setMetaTotal] = useState<number>(0);
  const [plazoMeses, setPlazoMeses] = useState<number>(1);
  const [fechaTermino, setFechaTermino] = useState("");

  // Participantes
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correos, setCorreos] = useState<string[]>([]);
  const [montos, setMontos] = useState<{ [correo: string]: number }>({});
  const [nombres, setNombres] = useState<{ [correo: string]: string }>({});
  const [usuariosMap, setUsuariosMap] = useState<{ [correo: string]: string }>({}); // correo → usuario_id

  // Cálculos derivados
  const totalIntegrantes = 1 + correos.length;
  const metaIndividual =
    metaTotal > 0 && totalIntegrantes > 0
      ? Math.round(metaTotal / totalIntegrantes)
      : 0;
  const aporteMensual =
    metaIndividual > 0 && plazoMeses > 0
      ? Math.round(metaIndividual / plazoMeses)
      : 0;

  // Inicializar montos para admin y participantes
  useEffect(() => {
    if (!correoUsuario) return;
    setMontos((prev) => {
      const copia = { ...prev };
      [correoUsuario, ...correos].forEach((c) => {
        copia[c] = aporteMensual;
      });
      return copia;
    });
  }, [metaTotal, plazoMeses, correos, correoUsuario]);

  // 🧩 Validación institucional: agregar participante por correo
  const agregarCorreo = async (correoLimpio: string) => {
    const correo = correoLimpio.trim().toLowerCase();

    if (!correo) {
      alert("⚠️ Debes ingresar un correo.");
      return;
    }
    if (correo === correoUsuario) {
      alert("⚠️ El administrador ya está incluido por defecto.");
      return;
    }
    if (correos.includes(correo)) {
      alert("⚠️ Ese correo ya fue agregado como participante.");
      return;
    }

    const { data: usuarioData, error } = await supabase
      .from("usuarios")
      .select("id, nombre, apellido")
      .eq("correo", correo)
      .maybeSingle();

    if (error) {
      console.error("❌ Error Supabase (agregarCorreo):", error);
      alert("❌ Error al validar el correo.");
      return;
    }

    if (!usuarioData) {
      alert("⚠️ El correo ingresado no está registrado en Finedu.");
      return;
    }

    const nombreCompleto = `${usuarioData.nombre ?? ""} ${usuarioData.apellido ?? ""}`.trim();

    setCorreos((prev) => [...prev, correo]);
    setNombres((prev) => ({ ...prev, [correo]: nombreCompleto || "Nombre no disponible" }));
    setUsuariosMap((prev) => ({ ...prev, [correo]: usuarioData.id })); // guardar usuario_id
    setMontos((prev) => ({ ...prev, [correo]: aporteMensual }));
    setNuevoCorreo("");
  };

  // Crear grupo con flujo blindado
  const crearGrupo = async () => {
    if (!nombreGrupo.trim() || !metaTotal || !plazoMeses || !fechaTermino) {
      alert("⚠️ Debes completar todos los campos obligatorios.");
      return;
    }

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

    await supabase.from("metadata_grupo").insert([
      { grupo_id: grupoId, pais, ciudad, comuna },
    ]);

    // 🧩 Insertar participantes cumpliendo RLS
    const { data: { user } } = await supabase.auth.getUser();

    const todosLosCorreos = [correoUsuario, ...correos];
    const miembros = todosLosCorreos.map((correo) => ({
      grupo_id: grupoId,
      usuario_id: usuariosMap[correo], // uuid desde tabla usuarios
      correo,
      rol: correo === correoUsuario ? "admin" : "participante",
      fecha_ingreso: new Date().toISOString(),
      estado: "activo",
      invitado_por: user?.id, // cumple RLS
    }));

    const { error: miembrosError } = await supabase
      .from("participantes_grupo")
      .insert(miembros);

    if (miembrosError) {
      console.error("❌ Error Supabase (insert participantes):", miembrosError);
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
    setMontos({});
    setNombres({});
    setUsuariosMap({});
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
        crearGrupo={crearGrupo}
        aporteMensual={aporteMensual}
      />
    </div>
  );
};

export default CrearGrupo;
