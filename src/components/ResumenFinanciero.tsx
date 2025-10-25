import React from "react";
import { Participante } from "../types";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";

type Props = {
  participantes: Participante[];
  metaGrupal: number;
  pais: string;
};

function ResumenFinanciero({ participantes, metaGrupal, pais }: Props) {
  // Validación inmediata antes de cualquier cálculo
  if (!participantes || !Array.isArray(participantes)) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3 style={{ color: "#c0392b" }}>⚠️ Datos no disponibles</h3>
        <p>No se pudo cargar la información de los participantes. Verifica que el módulo esté recibiendo los datos correctamente.</p>
      </div>
    );
  }

  const correoUsuario = localStorage.getItem("correo");
  const usuario = participantes.find(p => p.correo === correoUsuario);

  if (!usuario) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3 style={{ color: "#c0392b" }}>⚠️ Usuario no encontrado</h3>
        <p>Por favor asegúrate de haber iniciado sesión correctamente y registrado tus datos.</p>
      </div>
    );
  }

  const tasaCredito = getTasa(pais, "consumo");
  const tasaInversion = getTasa(pais, "inversion");

  const totalAhorroGrupal = participantes.reduce(
    (total, p) => total + (p.ingresos - p.egresos),
    0
  );

  const cuotaCredito = (metaGrupal * (tasaCredito / 12 / 100)) /
    (1 - Math.pow(1 + tasaCredito / 12 / 100, -12));
  const totalCredito = cuotaCredito * 12;

  const montoInversion = totalAhorroGrupal;
  const montoFinalInversion = montoInversion * Math.pow(1 + tasaInversion / 12 / 100, 12);
  const gananciaInversion = montoFinalInversion - montoInversion;

  const ahorroPersonal = usuario.ingresos - usuario.egresos;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem", color: "#2c3e50" }}>
        💸 Resumen de {usuario.nombre} {usuario.apellido}
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
    </div>
  );
}

export default ResumenFinanciero;
