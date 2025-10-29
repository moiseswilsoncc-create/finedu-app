import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";
import { Usuario } from "../types";

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = "TU_API_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

function ResumenFinanciero() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [participantes, setParticipantes] = useState<Usuario[]>([]);
  const [metaGrupal, setMetaGrupal] = useState<number>(0);
  const [pais, setPais] = useState("Chile");
  const [error, setError] = useState("");

  const correoUsuario = localStorage.getItem("correo");

  useEffect(() => {
    const cargarDatos = async () => {
      if (!correoUsuario) {
        setError("No se encontró el correo en localStorage.");
        return;
      }

      const { data: usuarioData, error: errorUsuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", correoUsuario)
        .single();

      if (errorUsuario || !usuarioData) {
        setError("Usuario no encontrado en Supabase.");
        return;
      }

      setUsuario(usuarioData);

      if (usuarioData.grupo_id) {
        const { data: grupoData } = await supabase
          .from("grupos")
          .select("meta_grupal, pais")
          .eq("id", usuarioData.grupo_id)
          .single();

        if (grupoData) {
          setMetaGrupal(grupoData.meta_grupal);
          setPais(grupoData.pais);
        }

        const { data: miembros } = await supabase
          .from("usuarios")
          .select("*")
          .eq("grupo_id", usuarioData.grupo_id);

        if (miembros) {
          setParticipantes(miembros);
        }
      }
    };

    cargarDatos();
  }, [correoUsuario]);

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3 style={{ color: "#e74c3c" }}>⚠️ {error}</h3>
        <p>Por favor inicia sesión correctamente para visualizar tu resumen.</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3 style={{ color: "#2980b9" }}>⏳ Cargando datos...</h3>
      </div>
    );
  }

  const tasaCredito = getTasa(pais, "consumo");
  const tasaInversion = getTasa(pais, "inversion");

  const ahorroPersonal = usuario.ingresos - usuario.egresos;
  const totalAhorroGrupal = participantes.reduce((total, p) => total + (p.ingresos - p.egresos), 0);
  const progresoGrupal = Math.min((totalAhorroGrupal / metaGrupal) * 100, 100);

  const cuotaCredito = (metaGrupal * (tasaCredito / 12 / 100)) /
    (1 - Math.pow(1 + tasaCredito / 12 / 100, -12));
  const totalCredito = cuotaCredito * 12;

  const montoFinalInversion = totalAhorroGrupal * Math.pow(1 + tasaInversion / 12 / 100, 12);
  const gananciaInversion = montoFinalInversion - totalAhorroGrupal;

  const porcentajeMetaIndividual = usuario.metaIndividual
    ? Math.min((ahorroPersonal / usuario.metaIndividual) * 100, 100)
    : null;

  const ranking = [...participantes].sort((a, b) => (b.ingresos - b.egresos) - (a.ingresos - a.egresos));
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem", color: "#2c3e50" }}>
        💸 Resumen de {usuario.nombre}
      </h2>

      <div style={{
        backgroundColor: "#ecf0f1",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "2rem"
      }}>
        <p><strong>Ingresos:</strong> {formatearMoneda(usuario.ingresos, pais)}</p>
        <p><strong>Egresos:</strong> {formatearMoneda(usuario.egresos, pais)}</p>
        <p><strong>Ahorro personal:</strong> {formatearMoneda(ahorroPersonal, pais)}</p>

        <button
          onClick={() => navigate("/editar-ingresos-egresos")}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#e67e22",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ✏️ Editar mis ingresos y egresos
        </button>

        {porcentajeMetaIndividual !== null && (
          <div style={{ marginTop: "1rem" }}>
            <label style={{ fontWeight: "bold" }}>🎯 Progreso hacia tu meta individual:</label>
            <div style={{ backgroundColor: "#ddd", borderRadius: "8px", overflow: "hidden", height: "20px", marginTop: "0.5rem" }}>
              <div style={{
                width: `${porcentajeMetaIndividual}%`,
                backgroundColor: porcentajeMetaIndividual >= 100 ? "#27ae60" : "#8e44ad",
                height: "100%"
              }} />
            </div>
            <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
              {porcentajeMetaIndividual.toFixed(1)}% de tu meta individual alcanzada
            </p>
          </div>
        )}
      </div>

      <h3 style={{ marginBottom: "1rem" }}>📊 Comparativo grupal ({pais})</h3>
      <ul style={{ backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
        <li>Meta grupal: {formatearMoneda(metaGrupal, pais)}</li>
        <li>Ahorro actual del grupo: {formatearMoneda(totalAhorroGrupal, pais)}</li>
        <li>
          Crédito de consumo (12 meses a {tasaCredito}% anual):{" "}
          {formatearMoneda(totalCredito, pais)}
        </li>
        <li>
          Inversión proyectada (12 meses a {tasaInversion}% anual):{" "}
          {formatearMoneda(montoFinalInversion, pais)} (ganancia:{" "}
          {formatearMoneda(gananciaInversion, pais)})
        </li>
      </ul>

      <div style={{ margin: "1rem 0" }}>
        <label style={{ fontWeight: "bold" }}>📈 Progreso grupal:</label>
        <div style={{ backgroundColor: "#ddd", borderRadius: "8px", overflow: "hidden", height: "20px", marginTop: "0.5rem" }}>
          <div style={{
            width: `${progresoGrupal}%`,
            backgroundColor: progresoGrupal >= 100 ? "#27ae60" : "#3498db",
            height: "100%"
          }} />
        </div>
        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
          {progresoGrupal.toFixed(1)}% de la meta grupal alcanzada
        </p>
      </div>

      <h3 style={{ marginTop: "2rem" }}>🏅 Ranking de ahorro grupal</h3>
      <ul style={{ backgroundColor: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
        {ranking.map((p, i) => (
          <li key={i}>
            {i + 1}. {p.nombre} — Ahorro: {formatearMoneda(p.ingresos - p.egresos, pais)}
          </li>
        ))}
      </ul>

      <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "1rem", fontStyle: "italic" }}>
        Última actualización: {new Date().toLocaleString("es-CL")}
      </p>
    </div>
  );
}

export default ResumenFinanciero;
