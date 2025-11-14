import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BloqueDatosGrupo from "./BloqueDatosGrupo";
import BloqueMetaFinanciera from "./BloqueMetaFinanciera";
import BloqueParticipantes from "./BloqueParticipantes";
import { useUserPerfil } from "../context/UserContext";

const CrearGrupo: React.FC = () => {
  const perfil = useUserPerfil();
  const correoUsuario = perfil?.correo?.trim().toLowerCase() || "";

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
  const [usuariosMap, setUsuariosMap] = useState<{ [correo: string]: string }>({});

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

  const crearGrupo = async () => {
    if (!nombreGrupo.trim() || !metaTotal || !plazoMeses || !fechaTermino) {
      alert("⚠️ Debes completar todos los campos obligatorios.");
      return;
    }

    // ✅ Obtener usuario autenticado (uuid)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ No se pudo obtener el usuario actual:", userError);
      alert("❌ No se pudo obtener el usuario actual.");
      return;
    }
    console.log("🧠 Usuario autenticado:", user.id, "Correo:", user.email);

    // ✅ Insertar grupo con uuid del administrador
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
          administrador_id: user.id, // ✅ uuid correcto
          created_at: new Date().toISOString(),
          estado: "activo", // ✅ columna real
        },
      ])
      .select()
      .single();

    if (grupoError || !grupoData) {
      console.error("❌ Error creando grupo:", grupoError);
      alert("❌ No se pudo crear el grupo.");
      return;
    }
    console.log("✅ Grupo creado:", grupoData);

    // ✅ Usar id_uuid como PK
    const grupoId = grupoData.id_uuid;

    // Insertar metadata
    const { error: metadataError } = await supabase.from("metadata_grupo").insert([
      { grupo_id: grupoId, pais, ciudad, comuna },
    ]);
    if (metadataError) {
      console.error("❌ Error insertando metadata:", metadataError);
    } else {
      console.log("✅ Metadata insertada");
    }

    // Insertar participantes
    const todosLosCorreos = [correoUsuario, ...correos];
    const miembros = todosLosCorreos.map((correo) => ({
      grupo_id: grupoId,
      usuario_id: usuariosMap[correo], // uuid desde tabla usuarios
      correo,
      rol: correo === correoUsuario ? "admin" : "participante",
      fecha_ingreso: new Date().toISOString(),
      estado: "activo", // ✅ coincide con columna real
      invitado_por: user.id,
    }));

    const { error: miembrosError } = await supabase
      .from("participantes_grupo")
      .insert(miembros);

    if (miembrosError) {
      console.error("❌ Error Supabase (insert participantes):", miembrosError);
      alert("❌ Error al registrar los participantes.");
      return;
    }
    console.log("✅ Participantes insertados:", miembros);

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
    return <p>⚠️ No se puede crear grupo sin usuario activo.</p>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🛠️ Crear nuevo grupo de ahorro</h2>
      {perfil && (
        <p style={{ fontWeight: "bold", color: "#2c3e50" }}>
          Administrador: {perfil.nombre} {perfil.apellido}
        </p>
      )}

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
        agregarCorreo={(c) => setCorreos((prev) => [...prev, c])}
        crearGrupo={crearGrupo}
        aporteMensual={aporteMensual}
      />
    </div>
  );
};

export default CrearGrupo;
