import { datosPorPais } from "../configFinanciera";

export function getTasa(pais: string, tipo: "consumo" | "auto" | "vivienda" | "inversion"): number {
  const datos = datosPorPais[pais] || datosPorPais["Chile"];

  switch (tipo) {
    case "consumo":
      return datos.tasaCreditoConsumo;
    case "auto":
      return datos.tasaCreditoAuto;
    case "vivienda":
      return datos.tasaCreditoVivienda;
    case "inversion":
      return datos.tasaInversion;
    default:
      return datos.tasaCreditoConsumo;
  }
}
