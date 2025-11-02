// src/components/ResumenFinanciero.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatearMoneda } from "../utils/formatearMoneda";

type Proyeccion = {
  mes: string;
  saldo: number;
  icono: string;
  mensaje: string;
};

const ResumenFinanciero: React.FC<{ pais: string }> = ({ pais }) => {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [creditos, setCreditos] = useState<{ cuota: number; fin: string }[]>([]);
  const [proyeccion, setProyeccion] = useState<Proyeccion[]>([]);
  const [saldoActual, setSaldoActual] = useState(0);

  // Comparativos con mes anterior
  const [diffIngresos, setDiffIngresos] = useState(0);
  const [diffEgresos, setDiffEgresos] = useState(0);
  const [diffSaldo, setDiffSaldo] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) return;

      const hoy = new Date();
      const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      // Ingresos actuales
      const { data: ingresosData } = await supabase.from("ingresos").select("monto").eq("usuario_id", usuarioId);
      const { data: ahorrosPersonales } = await supabase.from("ahorros_personales").select("monto").eq("usuario_id", usuarioId);
      const { data: inversiones } = await supabase.from("inversiones").select("monto").eq("usuario_id", usuarioId);

      const totalIngresos =
        (ingresosData?.reduce((sum, i) => sum + i.monto, 0) || 0) +
        (ahorrosPersonales?.reduce((sum, a) => sum + a.monto, 0) || 0) +
        (inversiones?.reduce((sum, inv) => sum + inv.monto, 0) || 0);
      setIngresos(totalIngresos);

      // Egresos actuales
      const { data: egresosData } = await supabase.from("egresos").select("monto").eq("usuario_id", usuarioId);
      const { data: ahorrosGrupales } = await supabase.from("ahorros_grupales").select("monto_mensual").eq("usuario_id", usuarioId).eq("activo", true);

      const totalEgresos =
        (egresosData?.reduce((sum, e) => sum + e.monto, 0) || 0) +
        (ahorrosGrupales?.reduce((sum, ag) => sum + ag.monto_mensual, 0) || 0);
      setEgresos(totalEgresos);

      // Créditos
      const { data: creditosData } = await supabase
        .from("creditos")
        .select("cuota_mensual, fecha_fin")
        .eq("usuario_id", usuarioId)
        .eq("activo", true);

      const listaCreditos = (creditosData || []).map((c: any) => ({
        cuota: c.cuota_mensual,
        fin: c.fecha_fin,
      }));
      setCreditos(listaCreditos);

      // Saldo actual
      const cuotasActivas = listaCreditos.reduce((sum, c) => sum + c.cuota, 0);
      const saldoMesActual = totalIngresos - (totalEgresos + cuotasActivas);
      setSaldoActual(saldoMesActual);
      // Comparativos con mes anterior
      const { data: ingresosPrev } = await supabase
        .from("ingresos")
        .select("monto, fecha")
        .eq("usuario_id", usuarioId)
        .gte("fecha", primerDiaMesAnterior.toISOString())
        .lte("fecha", ultimoDiaMesAnterior.toISOString());
      const totalIngresosPrev = ingresosPrev?.reduce((sum, i) => sum + i.monto, 0) || 0;

      const { data: egresosPrev } = await supabase
        .from("egresos")
        .select("monto, fecha")
        .eq("usuario_id", usuarioId)
        .gte("fecha", primerDiaMesAnterior.toISOString())
        .lte("fecha", ultimoDiaMesAnterior.toISOString());
      const totalEgresosPrev = egresosPrev?.reduce((sum, e) => sum + e.monto, 0) || 0;

      const saldoPrev = totalIngresosPrev - totalEgresosPrev;

      setDiffIngresos(totalIngresos - totalIngresosPrev);
      setDiffEgresos(totalEgresos - totalEgresosPrev);
      setDiffSaldo(saldoMesActual - saldoPrev);

      // Proyección 6 meses
      const proy: Proyeccion[] = [];
      for (let i = 0; i < 6; i++) {
        const fecha = new Date(hoy);
        fecha.setMonth(hoy.getMonth() + i);

        const cuotasMes = listaCreditos
          .filter((c) => new Date(c.fin) >= fecha)
          .reduce((sum, c) => sum + c.cuota, 0);

        const saldo = totalIngresos - (totalEgresos + cuotasMes);

        let icono = "👍";
        let mensaje = "Buen nivel de ahorro";
        if (saldo < 0) {
          icono = "🤒";
          mensaje = "Saldo negativo, riesgo de no llegar a fin de mes";
        } else if (saldo < totalIngresos * 0.1) {
          icono = "😷";
          mensaje = "Saldo muy ajustado, revisa tus gastos";
        } else if (saldo > totalIngresos * 0.2) {
          icono = "😀";
          mensaje = "Excelente, tienes margen para ahorrar más";
        }

        proy.push({
          mes: fecha.toLocaleDateString("es-CL", { month: "long", year: "numeric" }),
          saldo,
          icono,
          mensaje,
        });
      }
      setProyeccion(proy);
    };

    cargarDatos();
  }, []);
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🩺 Mi Salud Financiera</h2>
      <p>Relación de ingresos, egresos, créditos, ahorros e inversiones con proyección a 6 meses.</p>

      <h3>📌 Resumen mes actual</h3>
      <ul>
        <li>Ingresos: {formatearMoneda(ingresos, pais)} {diffIngresos > 0 ? "🔼" : diffIngresos < 0 ? "🔽" : "➡️"}</li>
        <li>Egresos: {formatearMoneda(egresos, pais)} {diffEgresos > 0 ? "🔼" : diffEgresos < 0 ? "🔽" : "➡️"}</li>
        <li>Saldo disponible: {formatearMoneda(saldoActual, pais)} {diffSaldo > 0 ? "🔼" : diffSaldo < 0 ? "🔽" : "➡️"}</li>
      </ul>

      <h3>📊 Proyección próximos 6 meses</h3>
      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Saldo disponible</th>
            <th>Indicador</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {proyeccion.map((p, i) => (
            <tr key={i}>
              <td>{p.mes}</td>
              <td>{formatearMoneda(p.saldo, pais)}</td>
              <td>{p.icono}</td>
              <td>{p.mensaje}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>📌 Estado final de salud financiera</h3>
      {proyeccion.length > 0 && (
        <p style={{ fontWeight: "bold" }}>
          {proyeccion[0].icono} Estado actual: {proyeccion[0].mensaje} <br />
          {proyeccion[proyeccion.length - 1].icono} Estado proyectado a 6 meses: {proyeccion[proyeccion.length - 1].mensaje}
        </p>
      )}
    </div>
  );
};

export default ResumenFinanciero;
