import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BloqueDatosGrupo from "./BloqueDatosGrupo";
import BloqueMetaFinanciera from "./BloqueMetaFinanciera";
import BloqueParticipantes from "./BloqueParticipantes";
import { useUserPerfil } from "../context/UserContext";

const CrearGrupo: React.FC = () => {
  // 1. 🔌 CONEXIÓN CON UserContext
  const { perfil, cargando } = useUserPerfil();

  // Datos generales
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");
  const [tipoAhorro, setTipoAhorro] = useState("Ahorro normal"); // ✅ NUEVO CAMPO OBLIGATORIO

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

  // Actualizar montos cuando cambia la meta o plazo
  useEffect(() => {
    if (!correoUsuario) return;
    setMontos((prev) => {
      const copia = { ...prev };
      [correoUsuario, ...correos].forEach((c) => {
        copia[c] = aporteMensual;
      });
      return copia;
    });
  }, [metaTotal, plazoMeses, correos, correoUsuario, aporteMensual]);

  // 2. ✅ FUNCIÓN MEJORADA: agregarCorreo con validación en Supabase
  const agregarCorreo = async (correoNuevo: string) => {
    const correoLimpio = correoNuevo.trim().toLowerCase();

    // Validación básica
    if (!correoLimpio) {
      alert("⚠️ Ingresa un correo válido");
      return;
    }

    if (correos.includes(correoLimpio)) {
      alert("⚠️ Este correo ya está en la lista");
      return;
    }

    if (correoLimpio === correoUsuario) {
      alert("⚠️ No puedes agregarte a ti mismo");
      return;
    }

    try {
      // 🔍 Buscar usuario en Supabase
      const { data: usuario, error } = await supabase
        .from("usuarios")
        .select("id, nombre, apellido")
        .eq("correo", correoLimpio)
        .maybeSingle();

      if (error) {
        console.error("Error al consultar usuarios:", error);
        alert("❌ Error al validar el correo. Intenta de nuevo.");
        return;
      }

      if (!usuario) {
        alert("⚠️ Este correo no está registrado en Finedu. El usuario debe crear su cuenta primero.");
        return;
      }

      // ✅ Usuario encontrado - Guardar datos
      setCorreos((prev) => [...prev, correoLimpio]);
      setUsuariosMap((prev) => ({ ...prev, [correoLimpio]: usuario.id }));
      setNombres((prev) => ({
        ...prev,
        [correoLimpio]: `${usuario.nombre} ${usuario.apellido}`,
      }));
      setNuevoCorreo(""); // Limpiar input

    } catch (err) {
      console.error("Error inesperado:", err);
      alert("❌ Error inesperado al validar el correo");
    }
  };

  // 3. 🚀 CREAR GRUPO con validación completa
  const crearGrupo = async () => {
    // Validaciones básicas
    if (!nombreGrupo.trim() || !metaTotal || !plazoMeses || !fechaTermino) {
      alert("⚠️ Debes completar todos los campos obligatorios.");
      return;
    }

    if (!perfil?.id) {
      alert("❌ Error de identidad: No se reconoce al administrador.");
      return;
    }

    // Validar que todos los invitados existan en usuariosMap
    const correosSinValidar = correos.filter(c => !usuariosMap[c]);
    if (correosSinValidar.length > 0) {
      alert(`⚠️ Algunos correos no están validados: ${correosSinValidar.join(", ")}`);
      return;
    }

    try {
      const administradorId = perfil.id;

      // ✅ CORREGIDO: Objeto con SOLO los campos que acepta la tabla
      const grupoData = {
        nombre: nombreGrupo.trim(),
        tipo_ahorro: tipoAhorro, // ✅ CAMPO OBLIGATORIO AGREGADO
        meta_total: metaTotal,
        aporte_mensual: aporteMensual,
        tasa: 0, // Campo opcional, ponemos 0 por defecto
        plazo_meses: plazoMeses,
        monto_final: metaTotal, // Proyección final
        fecha_inicio: new Date().toISOString(),
        fecha_fin: fechaTermino,
        administrador_id: administradorId,
        estado: "activo", // Campo opcional con default
      };

      console.log("📦 Datos del grupo a insertar:", grupoData);

      // Insertar grupo
      const { data: grupoInsertado, error: grupoError } = await supabase
        .from("grupos_ahorro")
        .insert([grupoData])
        .select()
        .single();

      if (grupoError) {
        console.error("❌ Error creando grupo:", grupoError);
        alert(`❌ No se pudo crear el grupo: ${grupoError.message}`);
        return;
      }

      if (!grupoInsertado || !grupoInsertado.id) {
        console.error("❌ No se obtuvo ID del grupo");
        alert("❌ Error: No se pudo obtener el ID del grupo creado");
        return;
      }

      const grupoId = grupoInsertado.id;
      console.log("✅ Grupo creado con ID:", grupoId);

      // Insertar metadata
      if (pais || ciudad || comuna) {
        const { error: metadataError } = await supabase
          .from("metadata_grupo")
          .insert([{ grupo_id: grupoId, pais, ciudad, comuna }]);

        if (metadataError) {
          console.warn("⚠️ Error al guardar metadata:", metadataError);
        }
      }

      // Insertar participantes (admin + invitados)
      const todosLosCorreos = [correoUsuario, ...correos];
      const miembros = todosLosCorreos.map((correo) => ({
        grupo_id: grupoId,
        usuario_id: correo === correoUsuario ? administradorId : usuariosMap[correo],
        nombre: correo === correoUsuario ? perfil.nombre : nombres[correo]?.split(" ")[0] || "",
        apellido: correo === correoUsuario ? perfil.apellido : nombres[correo]?.split(" ").slice(1).join(" ") || "",
        correo,
        rol: correo === correoUsuario ? "administrador" : "miembro",
        fecha_ingreso: new Date().toISOString(),
        estado: "activo",
        invitado_por: administradorId,
      }));

      console.log("👥 Participantes a insertar:", miembros);

      const { error: miembrosError } = await supabase
        .from("participantes_grupo")
        .insert(miembros);

      if (miembrosError) {
        console.error("❌ Error insertando participantes:", miembrosError);
        alert("⚠️ Grupo creado, pero hubo error al registrar participantes.");
        return;
      }

      // Registro en Historial
      await supabase.from("historial_grupo").insert({
        grupo_id: grupoId,
        usuario_id: administradorId,
        tipo_evento: "creación",
        detalle: `Grupo "${nombreGrupo}" creado con meta de $${metaTotal}`,
        fecha: new Date().toISOString(),
      });

      alert(`✅ Grupo "${nombreGrupo}" creado exitosamente.`);

      // Reset
      setNombreGrupo("");
      setPais("");
      setCiudad("");
      setComuna("");
      setTipoAhorro("Ahorro normal");
      setMetaTotal(0);
      setPlazoMeses(1);
      setFechaTermino("");
      setCorreos([]);
      setMontos({});
      setNombres({});
      setUsuariosMap({});
    } catch (error: any) {
      console.error("❌ Error inesperado:", error);
      alert(`❌ Error inesperado al crear el grupo: ${error.message || "Desconocido"}`);
    }
  };

  // 4. 🚦 BLINDAJE DE PANTALLA
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

  // 5. RENDERIZADO
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🛠️ Crear nuevo grupo de ahorro
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-100 flex justify-between items-center">
        <div>
          <span className="font-bold text-blue-800">Administrador:</span>
          <span className="ml-2 text-gray-700">
            {perfil.nombre} {perfil.apellido}
          </span>
        </div>
        <span className="text-sm text-gray-500">{perfil.correo}</span>
      </div>

      {/* ✅ NUEVO: Selector de tipo de ahorro */}
      <div className="mb-6 p-4 bg-white rounded border border-gray-200">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tipo de ahorro:
        </label>
        <select
          value={tipoAhorro}
          onChange={(e) => setTipoAhorro(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="Ahorro normal">Ahorro normal</option>
          <option value="Ahorro con interés">Ahorro con interés</option>
          <option value="Ahorro en UF">Ahorro en UF</option>
          <option value="APV">APV</option>
          <option value="Otro">Otro</option>
        </select>
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
        agregarCorreo={agregarCorreo}
        crearGrupo={crearGrupo}
        aporteMensual={aporteMensual}
        usuariosMap={usuariosMap}
        setUsuariosMap={setUsuariosMap}
      />
    </div>
  );
};

export default CrearGrupo;
