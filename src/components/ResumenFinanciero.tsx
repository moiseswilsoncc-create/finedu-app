import React, { useEffect, useState } from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";
import { Usuario } from "../types";

function ResumenFinanciero() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [participantes, setParticipantes] = useState<Usuario[]>([]);
  const [metaGrupal, setMetaGrupal] = useState<number>(0);
  const [error, setError] = useState("");

  const correoUsuario = localStorage.getItem("correo");

  useEffect(() => {
    // 🔒 En la segunda etapa se reemplazará por conexión a Supabase
    const datosSimulados: Usuario[] = [
      {
        nombre: "Usuario",
        correo: "usuario@finedu.cl",
        ingresos: 500000,
        egresos: 200000,
        grupo_id: "grupo1"
      },
      {
        nombre: "Otro",
        correo: "otro@finedu.cl",
        ingresos: 400000,
        egresos: 250000,
        grupo_id: "grupo1"
      }
    ];

    const grupoSimulado = {
      id: "grupo1",
      meta_grupal: 1000000,
      pais: "Chile"
    };

    if (!correoUsuario) {
      setError("No se encontró el correo en localStorage.");
      return;
    }

    const usuarioEncontrado = datosSimulados.find(
      p => p.correo.trim().toLowerCase() === correoUsuario.trim().toLowerCase()
    );

    if (!usuarioEncontrado) {
      setError("Usuario no encontrado en datos simulados.");
      return;
    }

    setUsuario(usuarioEncontrado);
    setParticipantes(datosSimulados);
    setMetaGrupal(grupoSimulado.meta_grupal);
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

  const pais = "Chile";
  const tasaCredito = getTasa(pais, "consumo");
  const tasaInversion = getTasa(pais, "inversion");

  const ahorroPersonal = usuario.ingresos - usuario.egresos;
  const totalAhorroGrupal = participantes.reduce((total, p) => total + (p.ingresos - p.egresos), 0);

  const cuotaCredito = (metaGrupal * (tasaCredito / 12 / 100)) /
    (1 - Math.pow(1 + tasaCredito / 12 / 100, -12));
  const totalCredito = cuotaCredito * 12;

  const montoFinalInversion = totalAhorroGrupal * Math.pow(1 + tasaInversion / 12 / 100, 12);
  const gananciaInversion = montoFinalInversion - totalAhorroGrupal;

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
