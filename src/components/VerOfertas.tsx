import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Oferta = {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  pais: string;
  fecha_expiracion: string;
  colaborador: string;
  fecha_publicacion: string;
};

const VerOfertas: React.FC = () => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [paisFiltro, setPaisFiltro] = useState("Chile");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarOfertas = async () => {
      setCargando(true);
      const hoy = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("ofertas_colaborador")
        .select("*")
        .eq("visibilidad", true)
        .gte("fecha_expiracion", hoy);

      if (data) {
        setOfertas(data);
      }

      setCargando(false);
    };

    cargarOfertas();
  }, []);

  const ofertasFiltradas = ofertas.filter((o) =>
    o.tipo.toLowerCase().includes(tipoFiltro.toLowerCase()) &&
    o.pais.toLowerCase().includes(paisFiltro.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>📌 Ofertas institucionales activas</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          placeholder="Filtrar por tipo (crédito, curso...)"
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <input
          placeholder="Filtrar por país"
          value={paisFiltro}
          onChange={(e) => setPaisFiltro(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
      </div>

      {cargando ? (
        <p>⏳ Cargando ofertas...</p>
      ) : ofertasFiltradas.length === 0 ? (
        <p>⚠️ No hay ofertas activas que coincidan con los filtros.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {ofertasFiltradas.map((oferta) => (
            <li key={oferta.id} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>{oferta.titulo}</h3>
              <p><strong>Tipo:</strong> {oferta.tipo}</p>
              <p><strong>Descripción:</strong> {oferta.descripcion}</p>
              <p><strong>País:</strong> {oferta.pais}</p>
              <p><strong>Expira:</strong> {new Date(oferta.fecha_expiracion).toLocaleDateString("es-CL")}</p>
              <p style={{ fontSize: "0.85rem", color: "#888" }}>
                Publicado por: {oferta.colaborador.split("@")[0]} el {new Date(oferta.fecha_publicacion).toLocaleDateString("es-CL")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VerOfertas;
