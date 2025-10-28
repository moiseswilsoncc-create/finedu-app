// src/institucional/DashboardInstitucional.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const DashboardInstitucional: React.FC = () => {
  const [datos, setDatos] = useState<any[]>([]);
  const [estado, setEstado] = useState("⏳ Cargando...");

  useEffect(() => {
    console.log("✅ DashboardInstitucional montado");

    const obtenerDatos = async () => {
      try {
        const { data, error } = await supabase
          .from("ahorro_por_region")
          .select("*");

        if (error) {
          console.error("❌ Error al obtener datos:", error.message);
          setEstado("❌ Error al obtener datos");
        } else if (!data || data.length === 0) {
          console.warn("⚠️ Sin datos disponibles");
          setEstado("⚠️ Sin datos disponibles");
        } else {
          console.log("📊 Datos obtenidos:", data);
          setDatos(data);
          setEstado("✅ Datos cargados correctamente");
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err);
        setEstado("❌ Error inesperado");
      }
    };

    obtenerDatos();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "green", fontSize: "1.5rem" }}>
      {estado}
    </div>
  );
};

export default DashboardInstitucional;
