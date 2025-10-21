import { datosPorPais } from "../configFinanciera";

export function formatearMoneda(valor: number, pais: string): string {
  const datos = datosPorPais[pais] || datosPorPais["Chile"];
  const simbolo = datos.simbolo;
  const codigoISO = datos.codigoISO;

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: codigoISO,
    minimumFractionDigits: 0,
  }).format(valor).replace(codigoISO, simbolo);
}
