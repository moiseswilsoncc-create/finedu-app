import React, { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient"; // 🔄 Activar en segunda fase

function DiagnosticoSistema() {
  const [reactOK, setReactOK] = useState(false);
  const [supabaseOK, setSupabaseOK] = useState(false);
  const [mensajeSupabase, setMensajeSupabase] = useState("");
  const [rolUsuario, setRolUsuario] = useState<string | null>(null);
  const [modulosOK, setModulosOK] = useState(false);

  useEffect(() => {
    console.log("✅ DiagnosticoSistema se está montando");
    setReactOK(true);

    // 🔄 Validación Supabase (activar en segunda fase)
    // const validarSupabase = async () => {
    //   const { data, error } = await supabase.from("usuarios").select("id").limit(1);
    //   if (data) {
    //     setSupabaseOK(true);
    //     setMensajeSupabase("✅ Supabase responde correctamente");
    //   } else {
    //     setMensajeSupabase("⚠️ Error al conectar con Supabase");
    //   }
    // };

    // const validarRol = async () => {
    //   const usuarioId = localStorage.getItem("usuarioId");
    //   const { data, error } = await supabase
    //     .from("usuarios")
    //     .select("rol")
    //     .eq("id", usuarioId)
    //     .single();
    //   if (data) setRolUsuario(data.rol);
    // };

    const validarModulos = () => {
      try {
        require("./MenuModulos");
        require("./Resumen");
        require("./PanelColaboradores");
        setModulosOK(true);
      } catch (error) {
        console.error("❌ Error al cargar módulos clave", error);
      }
    };

    // validarSupabase();
    // validarRol();
    validarModulos();
  }, []);

  return (
    <div style={{ padding: "2rem", marginTop: "2rem", textAlign: "center" }}>
      <h2>🧪 Diagnóstico del sistema</h2>

      <div
        style={{
          backgroundColor: reactOK ? "green" : "gray",
          color: "white",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        {reactOK ? "✅ React está funcionando correctamente" : "⏳ Verificando React..."}
      </div>

      <div
        style={{
          backgroundColor: supabaseOK ? "green" : "gray",
          color: "white",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        {mensajeSupabase || "⏳ Supabase pendiente de activación"}
      </div>

      <div
        style={{
          backgroundColor: modulosOK ? "green" : "gray",
          color: "white",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        {modulosOK
          ? "✅ Módulos clave cargados correctamente"
          : "⏳ Verificando módulos clave..."}
      </div>

      <div
        style={{
          backgroundColor: rolUsuario ? "green" : "gray",
          color: "white",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        {rolUsuario
          ? `✅ Rol detectado: ${rolUsuario}`
          : "⏳ Rol pendiente de activación"}
      </div>
    </div>
  );
}

export default DiagnosticoSistema;
