// src/components/Finanza.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { formatearMoneda } from "../utils/formatearMoneda";

const Finanza: React.FC<{ pais: string }> = ({ pais }) => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("Usuario");
  const [saldoActual, setSaldoActual] = useState(0);
  const [icono, setIcono] = useState("👍");
  const [mensaje, setMensaje] = useState("");
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [historico, setHistorico] = useState<{ mes: string; icono: string }[]>([]);
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    const cargarEstado = async () => {
      const usuarioId = localStorage.getItem("usuarioId");
      const correo = localStorage.getItem("correoColaborador");
      if (correo) setUsuario(correo.split("@")[0]);

      if (!usuarioId) return;

      const hoy = new Date();

      // Ingresos y egresos actuales
      const { data: ingresosData } = await supabase.from("ingresos").select("monto").eq("usuario_id", usuarioId);
      const { data: egresosData } = await supabase.from("egresos").select("monto").eq("usuario_id", usuarioId);

      const totalIngresos = ingresosData?.reduce((sum, i) => sum + i.monto, 0) || 0;
      const totalEgresos = egresosData?.reduce((sum, e) => sum + e.monto, 0) || 0;

      setIngresos(totalIngresos);
      setEgresos(totalEgresos);

      const saldo = totalIngresos - totalEgresos;
      setSaldoActual(saldo);

      // Estado actual
      if (saldo < 0) {
        setIcono("🤒");
        setMensaje("Saldo negativo, riesgo de no llegar a fin de mes");
        setAlerta("⚠️ Tu saldo es negativo, revisa tus gastos urgentemente.");
      } else if (saldo < totalIngresos * 0.1) {
        setIcono("😷");
        setMensaje("Saldo muy ajustado, revisa tus gastos");
        setAlerta("⚠️ Tu saldo está muy ajustado, podrías no llegar a fin de mes.");
      } else if (saldo > totalIngresos * 0.2) {
        setIcono("😀");
        setMensaje("Excelente, tienes margen para ahorrar más");
        setAlerta("🎉 Buen trabajo, podrías aumentar tu ahorro este mes.");
      } else {
        setIcono("👍");
        setMensaje("Buen nivel de ahorro");
        setAlerta("");
      }

      // Histórico últimos 3 meses
      const meses: { mes: string; icono: string }[] = [];
      for (let i = 1; i <= 3; i++) {
        const fecha = new Date(hoy);
        fecha.setMonth(hoy.getMonth() - i);

        const { data: ingresosMes } = await supabase
          .from("ingresos")
          .select("monto, fecha")
          .eq("usuario_id", usuarioId)
          .gte("fecha", new Date(fecha.getFullYear(), fecha.getMonth(), 1).toISOString())
          .lte("fecha", new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).toISOString());

        const { data: egresosMes } = await supabase
          .from("egresos")
          .select("monto, fecha")
          .eq("usuario_id", usuarioId)
          .gte("fecha", new Date(fecha.getFullYear(), fecha.getMonth(), 1).toISOString())
          .lte("fecha", new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).toISOString());

        const totalIng = ingresosMes?.reduce((sum, i) => sum + i.monto, 0) || 0;
        const totalEgr = egresosMes?.reduce((sum, e) => sum + e.monto, 0) || 0;
        const saldoMes = totalIng - totalEgr;

        let iconoMes = "👍";
        if (saldoMes < 0) iconoMes = "🤒";
        else if (saldoMes < totalIng * 0.1) iconoMes = "😷";
        else if (saldoMes > totalIng * 0.2) iconoMes = "😀";

        meses.push({
          mes: fecha.toLocaleDateString("es-CL", { month: "long" }),
          icono: iconoMes,
        });
      }
      setHistorico(meses.reverse());
    };

    cargarEstado();
  }, []);

  const modulos = [
    { titulo: "💵 Ingresos", ruta: "/ingresos", descripcion: "Registra y gestiona tus ingresos" },
    { titulo: "💸 Egresos", ruta: "/egresos", descripcion: "Controla tus gastos y compromisos" },
    { titulo: "🤝 Ofertas de Colaboradores", ruta: "/ofertas", descripcion: "Accede a oportunidades y beneficios" },
    { titulo: "💳 Simulador de Créditos", ruta: "/creditos", descripcion: "Simula créditos y cuotas" },
    { titulo: "📊 Resumen Financiero", ruta: "/", descripcion: "Tu salud financiera consolidada" },
  ];

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🩺 Tu Salud Financiera</h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        Hola, <strong>{usuario}</strong> 👋
      </p>
      <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        Tu estado actual: <strong>{icono}</strong> {mensaje}
      </p>
      <p style={{ color: "#2c3e50", marginBottom: "2rem" }}>
        Saldo disponible: {formatearMoneda(saldoActual, pais)}
      </p>

      {alerta && (
        <p style={{ color: alerta.includes("⚠️") ? "red" : "green", fontWeight: "bold" }}>
          {alerta}
        </p>
      )}

      <h3>📊 Últimos 3 meses</h3>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {historico.map((h, i) => (
          <div key={i} style={miniCard}>
            <strong>{h.mes}</strong> <br /> {h.icono}
          </div>
        ))}
      </div>

      <h3>📌 Indicadores rápidos</h3>
      <div style={kpiGrid}>
        <div style={kpiCard}>💵 Ingresos: {formatearMoneda(ingresos, pais)}</div>
        <div style={kpiCard}>💸 Egresos: {formatearMoneda(egresos, pais)}</div>
        <div style={kpiCard}>📊 Saldo: {formatearMoneda(saldoActual, pais)}</div>
      </div>

      <h3 style={{ marginTop: "2rem" }}>📂 Módulos disponibles</h3>
      <div style={gridStyle}>
        {modulos.map((m, index) => (
          <div key={index} style={cardStyle} onClick={() => navigate(m.ruta)}>
            <h3>{m.titulo}</h3>
            <p>{m.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "2rem auto",
  padding: "2rem",
};

const titleStyle = {
  color: "#2c3e50",
  marginBottom: "1rem",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
 gap: "1.5rem",

