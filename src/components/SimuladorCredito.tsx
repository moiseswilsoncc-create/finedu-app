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
      // Aporte grupal activo
      const { data: ahorro, error: errorAhorro } = await supabase
        .from("aportes_grupales")
        .select("monto_mensual")
        .eq("usuario_id", usuarioId)
        .eq("activo", true)
        .single();

      if (ahorro) setCuotaAhorro(ahorro.monto_mensual);

      // Créditos vigentes
      const { data: creditos, error: errorCreditos } = await supabase
        .from("creditos_tomados")
        .select("cuota_mensual")
        .eq("usuario_id", usuarioId)
        .eq("activo", true);

      if (creditos) {
        const total = creditos.reduce((sum, c) => sum + c.cuota_mensual, 0);
        setCuotasVigentes(total);
      }

      // Integrantes del grupo (si aplica)
      if (grupoActivo) {
        const { data: grupo, error: errorGrupo } = await supabase
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

  return (
    <div>
      <h3>Simulador de crédito de consumo ({pais})</h3>

      <label>
        Monto solicitado:
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
        />
      </label>

      <label>
        Plazo en meses:
        <input
          type="number"
          value={plazoMeses}
          onChange={(e) => setPlazoMeses(Number(e.target.value))}
        />
      </label>

      <ul>
        <li>Tasa base anual: {tasaBase}%</li>
        <li>Cuota mensual estimada: {formatearMoneda(cuotaSimulada, pais)}</li>
        <li>Total pagado: {formatearMoneda(totalPagado, pais)}</li>
        <li>Sobreprecio por intereses: {formatearMoneda(sobrecosto, pais)}</li>
        {grupoActivo && integrantesGrupo !== null && (
          <li>
            Impacto grupal estimado (x{integrantesGrupo}):{" "}
            {formatearMoneda(impactoGrupal, pais)}
          </li>
        )}
        <li>Compromiso de ahorro mensual: {formatearMoneda(cuotaAhorro, pais)}</li>
        <li>Cuotas de créditos vigentes: {formatearMoneda(cuotasVigentes, pais)}</li>
        <li>
          <strong>
            Cuota total mensual estimada: {formatearMoneda(cuotaTotalMensual, pais)}
          </strong>
        </li>
      </ul>
    </div>
  );
}

export default SimuladorCredito;
