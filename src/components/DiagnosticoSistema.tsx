import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function DiagnosticoSistema() {
  const [reactOK, setReactOK] = useState(false);
  const [supabaseOK, setSupabaseOK] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    console.log("✅ DiagnosticoSistema se está montando");
    setReactOK(true);

    // 🔄 Validación Supabase (activar en segunda fase)
    // const validarSupabase = async () => {
    //   const { data, error } = await supabase.from("usuarios").select("id").limit(1);
    //   if (data) {
    //     setSupabaseOK(true);
    //     setMensaje("✅ Supabase responde correctamente");
    //   } else {
    //     setMensaje("⚠️ Error al conectar con Supabase");
    //   }
    // };
    // validarSupabase();
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
        }}
      >
        {mensaje || "⏳ Supabase pendiente de activación"}
      </div>
    </div>
  );
}

export default DiagnosticoSistema;
