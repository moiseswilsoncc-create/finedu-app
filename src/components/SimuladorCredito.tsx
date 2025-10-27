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
  const [integrantesGrupo, setIntegrantesGrupo] = useState<number | null>(null);

  useEffect(() => {
    const obtenerIntegrantes = async () => {
      if (!grupoActivo) return;

      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) return;

      const { data, error } = await supabase
        .from("grupos_financieros")
        .select("integrantes")
        .eq("usuario_id", usuarioId)
        .single();

      if (error || !data) {
        console.error("Error al obtener integrantes del grupo:", error?.message);
        return;
      }

      setIntegrantesGrupo(data.integrantes);
    };

    obtenerIntegrantes();
  }, [grupoActivo]);

  const tasaMensual = tasaBase / 12 / 100;
  const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
  const totalPagado = cuota * plazoMeses;
  const sobrecosto = totalPagado - monto;
  const impactoGrupal =
    grupoActivo && integrantesGrupo ? sobrecosto * integrantesGrupo : 0;

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
        <li>Cuota mensual estimada: {formatearMoneda(cuota, pais)}</li>
        <li>Total pagado: {formatearMoneda(totalPagado, pais)}</li>
        <li>Sobreprecio por intereses: {formatearMoneda(sobrecosto, pais)}</li>
        {grupoActivo && integrantesGrupo !== null && (
          <li>
            Impacto grupal estimado (x{integrantesGrupo}):{" "}
            {formatearMoneda(impactoGrupal, pais)}
          </li>
        )}
      </ul>
    </div>
  );
}

export default SimuladorCredito;
