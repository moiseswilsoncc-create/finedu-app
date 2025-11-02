import React, { useEffect, useState } from "react";
import { getTasa } from "../utils/getTasa";
import { formatearMoneda } from "../utils/formatearMoneda";
import { supabase } from "../supabaseClient";

type Props = {
  pais: string;
  grupoActivo?: boolean;
};

function SimuladorCredito({ pais, grupoActivo = false }: Props) {
  const tasaBase = getTasa(pais, "consumo");
  const [monto, setMonto] = useState(1000000);
  const [plazoMeses, setPlazoMeses] = useState(12);
  const [cuotaAhorro, setCuotaAhorro] = useState(0);
  const [cuotasVigentes, setCuotasVigentes] = useState(0);
  const [integrantesGrupo, setIntegrantesGrupo] = useState<number | null>(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) return;

    const obtenerDatosFinancieros = async () => {
      const { data: ahorro } = await supabase
        .from("aportes_grupales")
        .select("monto_mensual")
        .eq("usuario_id", usuarioId)
        .eq("activo", true)
        .single();

      if (ahorro) setCuotaAhorro(ahorro.monto_mensual);

      const { data: creditos } = await supabase
        .from("creditos_tomados")
        .select("cuota_mensual")
        .eq("usuario_id", usuarioId)
        .eq("activo", true);

      if (creditos) {
        const total = creditos.reduce((sum, c) => sum + c.cuota_mensual, 0);
        setCuotasVigentes(total);
      }

      if (grupoActivo) {
        const { data: grupo } = await supabase
          .from("grupos_financieros")
          .select("integrantes")
          .eq("usuario_id", usuarioId)
          .single();

        if (grupo) setIntegrantesGrupo(grupo.integrantes);
      }
    };

    obtenerDatosFinancieros();
  }, [grupoActivo]);

  const tasaMensual = tasaBase / 12 / 100;
  const cuotaSimulada = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
  const totalPagado = cuotaSimulada * plazoMeses;
  const sobrecosto = totalPagado - monto;
  const impactoGrupal =
    grupoActivo && integrantesGrupo ? sobrecosto * integrantesGrupo : 0;

  const cuotaTotalMensual = cuotaSimulada + cuotaAhorro + cuotasVigentes;

  const registrarSimulacionCredito = async () => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) return;

    const { error } = await supabase.from("simulaciones").insert([
      {
        usuario: usuarioId,
        tipo: "credito",
        pais,
        monto_solicitado: monto,
        plazo_meses: plazoMeses,
        cuota_mensual: cuotaSimulada,
        cuota_total_mensual: cuotaTotalMensual,
        fecha: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error("❌ Error al registrar simulación de crédito:", error.message);
    } else {
      console.log("✅ Simulación de crédito registrada en Supabase");
    }

    await supabase.from("registro_actividad").insert([
      {
        usuario: usuarioId,
        modulo: "SimuladorCredito",
        accion: "Simulación ejecutada",
        fecha: new Date().toISOString()
      }
    ]);
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "700px",
      margin: "2rem auto",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
        🧮 Simulador de crédito de consumo ({pais})
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        <label>
          Monto solicitado:
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Plazo en meses:
          <input
            type="number"
            value={plazoMeses}
            onChange={(e) => setPlazoMeses(Number(e.target.value))}
            style={{ marginLeft: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
      </div>

      <ul style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
        <li>Tasa base anual: {tasaBase}%</li>
        <li>Cuota mensual estimada: {formatearMoneda(cuotaSimulada, pais)}</li>
        <li>Total pagado: {formatearMoneda(totalPagado, pais)}</li>
        <li>Sobreprecio por intereses: {formatearMoneda(sobrecosto, pais)}</li>
        {grupoActivo && integrantesGrupo !== null && (
          <li>
            Impacto grupal estimado (x{integrantesGrupo}): {formatearMoneda(impactoGrupal, pais)}
          </li>
        )}
        <li>Compromiso de ahorro mensual: {formatearMoneda(cuotaAhorro, pais)}</li>
        <li>Cuotas de créditos vigentes: {formatearMoneda(cuotasVigentes, pais)}</li>
        <li>
          <strong>Cuota total mensual estimada: {formatearMoneda(cuotaTotalMensual, pais)}</strong>
        </li>
      </ul>

      <button
        onClick={registrarSimulacionCredito}
        style={{
          marginTop: "1.5rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#e67e22",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        📥 Guardar simulación
      </button>
    </div>
  );
}

export default SimuladorCredito;
