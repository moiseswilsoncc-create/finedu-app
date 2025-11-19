import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BloqueDatosGrupo from "./BloqueDatosGrupo";
import BloqueMetaFinanciera from "./BloqueMetaFinanciera";
import BloqueParticipantes from "./BloqueParticipantes";
import { useUserPerfil } from "../context/UserContext";

const CrearGrupo: React.FC = () => {
  // 1. 🔌 CONEXIÓN NUEVA: Desestructuramos { perfil, cargando }
  const { perfil, cargando } = useUserPerfil();

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
  // Mapa para guardar los UUIDs reales de los usuarios encontrados
  const [usuariosMap, setUsuariosMap] = useState<{ [correo: string]: string }>({});

  const correoUsuario = perfil?.correo || "";

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

    if (!perfil?.id) {
      alert("❌ Error de identidad: No se reconoce al administrador.");
      return;
    }

    // 2. USAMOS EL ID DIRECTO DEL CONTEXTO (Ya no consultamos a la BD extra)
    const administradorId = perfil.id;

    // Insertar grupo
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
          administrador_id: administradorId,
          created_at: new Date().toISOString(),
          estado: "activo",
        },
      ])
      .select()
      .single();

    if (grupoError || !grupoData) {
      console.error("❌ Error creando grupo:", grupoError);
      alert("❌ No se pudo crear el grupo.");
      return;
    }

    const grupoId = grupoData.id;

    // Insertar metadata
    await supabase
      .from("metadata_grupo")
      .insert([{ grupo_id: grupoId, pais, ciudad, comuna }]);

    // Insertar participantes
    const todosLosCorreos = [correoUsuario, ...correos];
    const miembros = todosLosCorreos.map((correo) => ({
      grupo_id: grupoId,
      // Si es el admin, usamos su ID directo. Si es invitado, usamos el mapa.
      usuario_id: correo === correoUsuario ? administradorId : usuariosMap[correo],
      correo, // Guardamos correo como referencia auxiliar
      rol: correo === correoUsuario ? "admin" : "participante",
      fecha_ingreso: new Date().toISOString(),
      estado: "activo",
      invitado_por: administradorId,
    }));

    const { error: miembrosError } = await supabase
      .from("participantes_grupo")
      .insert(miembros);

    if (miembrosError) {
      console.error("❌ Error insertando participantes:", miembrosError);
      alert("❌ Grupo creado, pero hubo error al registrar participantes.");
      return;
    }

    // Registro en Historial
    await supabase.from("historial_grupo").insert({
        grupo_id: grupoId,
        usuario_id: administradorId,
        tipo_evento: "creación",
        detalle: `Grupo "${nombreGrupo}" creado con meta de $${metaTotal}`,
        fecha: new Date().toISOString()
    });

    alert(`✅ Grupo "${nombreGrupo}" creado exitosamente.`);

    // Reset
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

  // 3. 🚦 BLINDAJE DE PANTALLA (Esto soluciona la pantalla "lisa")
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 text-xl font-semibold animate-pulse">
          ⏳ Cargando formulario...
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="p-8 text-center border rounded bg-red-50 text-red-600">
        ⚠️ No se detectó usuario activo. Por favor recarga la página.
      </div>
    );
  }

  // 4. RENDERIZADO DE LOS MÓDULOS
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛠️ Crear nuevo grupo de ahorro</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-100 flex justify-between items-center">
        <div>
            <span className="font-bold text-blue-800">Administrador:</span> 
            <span className="ml-2 text-gray-700">{perfil.nombre} {perfil.apellido}</span>
        </div>
        <span className="text-sm text-gray-500">{perfil.correo}</span>
      </div>

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
        setFechaTermino={setFechaTermino}
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
        // Pasamos el mapa para guardar los IDs reales de los invitados
        usuariosMap={usuariosMap}
        setUsuariosMap={setUsuariosMap}
      />
    </div>
  );
};

export default CrearGrupo;
