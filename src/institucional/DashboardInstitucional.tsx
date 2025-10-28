// src/institucional/DashboardInstitucional.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const DashboardInstitucional: React.FC = () => {
  const [estado, setEstado] = useState("⏳ Conectando a Supabase...");
  const [datos, setDatos] = useState<any[] | null>(null);

  useEffect(() => {
    console.log("✅ DashboardInstitucional montado");

    const obtenerDatos = async () => {
      try {
        const respuesta = await supabase
          .from("ahorro_por_region")
          .select("*");

        if (respuesta.error) {
          console.error("❌ Error al obtener datos:", respuesta.error.message);
          setEstado("❌ Error al obtener datos");
        } else if (!respuesta.data || !Array.isArray(respuesta.data)) {
          console.warn("⚠️ Respuesta inesperada");
          setEstado("⚠️ Respuesta inesperada");
        } else if (respuesta.data.length === 0) {
          console.warn("⚠️ Sin datos disponibles");
          setEstado("⚠️ Sin datos disponibles");
        } else {
          console.log("📊 Datos obtenidos:", respuesta.data);
          setDatos(respuesta.data);
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
    <div style={{ padding: "2rem", fontSize: "1.5rem", color: "#333" }}>
      <p>{estado}</p>
      {Array.isArray(datos) && datos.length > 0 && (
        <ul>
          {datos.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardInstitucional;
