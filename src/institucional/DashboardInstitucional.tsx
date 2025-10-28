// src/institucional/DashboardInstitucional.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const DashboardInstitucional = () => {
  const [estado, setEstado] = useState("⏳ Cargando...");
  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {
    console.log("🧩 Componente montado");
    console.log("🔍 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("🔍 Supabase KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

    const cargarDatos = async () => {
      try {
        const { data, error } = await supabase.from("ahorro_por_region").select("*");
        console.log("📊 Supabase respuesta:", { data, error });

        if (error) {
          setEstado("❌ Error al obtener datos");
        } else if (!data || data.length === 0) {
          setEstado("⚠️ Sin datos disponibles");
        } else {
          setEstado("✅ Datos cargados correctamente");
          setDatos(data);
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err);
        setEstado("❌ Error inesperado");
      }
    };

    cargarDatos();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard Institucional</h1>
      <p>{estado}</p>
      <ul>
        {datos.map((fila, index) => (
          <li key={index}>{JSON.stringify(fila)}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardInstitucional;
