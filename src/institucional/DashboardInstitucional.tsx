// src/institucional/DashboardInstitucional.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient"; // ← Ruta corregida

const DashboardInstitucional: React.FC = () => {
  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {
    console.log("✅ DashboardInstitucional montado");

    const obtenerDatos = async () => {
      try {
        const { data, error } = await supabase
          .from("ahorro_por_region") // ← tabla pendiente que tú institucionalizaste
          .select("*");

        if (error) {
          console.error("❌ Error al obtener datos:", error.message);
        } else {
          console.log("📊 Datos obtenidos:", data);
          setDatos(data);
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "green", fontSize: "1.5rem" }}>
      ✅ DashboardInstitucional cargado correctamente
    </div>
  );
};

export default DashboardInstitucional;
