import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const MetricaSupabase: React.FC = () => {
  const [usuarios, setUsuarios] = useState(0);
  const [simulaciones, setSimulaciones] = useState(0);
  const [ofertas, setOfertas] = useState(0);
  const [colaboradores, setColaboradores] = useState(0);

  useEffect(() => {
    const cargarMétricas = async () => {
      const [{ count: u }, { count: s }, { count: o }, { count: c }] = await Promise.all([
        supabase.from("usuarios").select("*", { count: "exact", head: true }),
        supabase.from("simulaciones").select("*", { count: "exact", head: true }),
        supabase.from("ofertas_colaborador").select("*", { count: "exact", head: true }).gt("fecha_expiracion", new Date().toISOString()),
        supabase.from("colaboradores").select("*", { count: "exact", head: true })
      ]);

      if (u !== null) setUsuarios(u);
      if (s !== null) setSimulaciones(s);
      if (o !== null) setOfertas(o);
      if (c !== null) setColaboradores(c);
    };

    cargarMétricas();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h3>👥 Usuarios registrados</h3>
        <p>{usuarios}</p>
      </div>
      <div style={cardStyle}>
        <h3>📈 Simulaciones totales</h3>
        <p>{simulaciones}</p>
      </div>
      <div style={cardStyle}>
        <h3>📢 Ofertas activas</h3>
        <p>{ofertas}</p>
      </div>
      <div style={cardStyle}>
        <h3>🧑‍💼 Colaboradores</h3>
        <p>{colaboradores}</p>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.5rem",
  marginTop: "1rem"
};

const cardStyle = {
  backgroundColor: "#ecf0f1",
  padding: "1.5rem",
  borderRadius: "10px",
  textAlign: "center" as const,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

export default MetricaSupabase;
