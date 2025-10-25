import React from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";

function ResumenFinanciero() {
  const correoUsuario = localStorage.getItem("correoUsuario");

  const participantes = [
    {
      nombre: "Usuario",
      apellido: "finedu",
      correo: "usuario@finedu.cl", // ✅ corregido para coincidir con sesión
      ingresos: 500000,
      egresos: 200000
    },
    {
      nombre: "Otro",
      apellido: "Miembro",
      correo: "otro@finedu.cl",
      ingresos: 400000,
      egresos: 250000
    }
  ];

  const metaGrupal = 1000000;
  const pais = "Chile";

  if (!correoUsuario) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3 style={{ color: "#e67e22" }}>⚠️ No se encontró el correo en localStorage</h3>
        <p>Por favor inicia sesión para que podamos identificarte.</p>
      </div>
    );
  }

  const usuario = participantes.find(
    p => p.correo.trim().toLowerCase() === correoUsuario.trim().toLowerCase()
  );

  if (!usuario) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3 style={{ color: "#c0392b" }}>⚠️ Usuario no encontrado</h3>
        <p>Correo en sesión: <strong>{correoUsuario}</strong></p>
        <p>Correos disponibles:</p>
        <ul>
          {participantes.map((p, i) => (
            <li key={i}>{p.correo}</li>
          ))}
        </ul>
        <p>Por favor asegúrate de que el correo coincida exactamente.</p>
      </div>
    );
  }

  const tasaCredito = getTasa(pais, "consumo");
  const tasaInversion = getTasa(pais, "inversion");

  const totalAhorroGrupal = participantes.reduce((total, p) => total + (p.ingresos - p.egresos), 0);

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
