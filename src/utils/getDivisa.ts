import { datosPorPais } from "../configFinanciera";

export function getDivisa(pais: string): { simbolo: string; nombre: string; codigoISO: string } {
  const datos = datosPorPais[pais] || datosPorPais["Chile"]; // fallback por defecto
  return {
    simbolo: datos.simbolo,
    nombre: datos.nombreDivisa,
    codigoISO: datos.codigoISO,
  };
}
