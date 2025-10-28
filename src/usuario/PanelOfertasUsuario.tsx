import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

interface Oferta {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  pais: string;
  fecha_expiracion: string;
  colaborador: string;
  fecha_publicacion: string;
}

const PanelOfertasUsuario: React.FC = () => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [paisFiltro, setPaisFiltro] = useState("Chile");

  useEffect(() => {
    const cargarOfertas = async () => {
      const hoy = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("ofertas_colaborador")
        .select("*")
        .eq("visible", true)
        .gte("fecha_expiracion", hoy);

      if (error) {
        console.error("Error al cargar ofertas:", error);
      } else {
        setOfertas(data || []);
      }
    };

    cargarOfertas();
  }, []);

  const ofertasFiltradas = ofertas.filter((o) => {
    const tipoOk = tipoFiltro ? o.tipo === tipoFiltro : true;
    const paisOk = paisFiltro ? o.pais === paisFiltro : true;
    return tipoOk && paisOk;
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🎯 Ofertas financieras activas</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} style={selectStyle}>
          <option value="">Todos los tipos</option>
          <option value="crédito">Crédito</option>
          <option value="curso">Curso</option>
          <option value="beneficio">Beneficio</option>
          <option value="tasa">
