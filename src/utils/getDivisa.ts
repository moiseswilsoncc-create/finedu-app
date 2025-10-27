// 📦 src/utils/getDivisa.ts
// 🔄 Utilidad institucional para obtener información de la divisa según país

import { datosPorPais } from "../configFinanciera";

export function getDivisa(pais: string): {
  simbolo: string;
  nombre: string;
  codigoISO: string;
} {
  const datos = datosPorPais[pais] || datosPorPais["Chile"]; // 🇨🇱 Fallback institucional por defecto

  return {
    simbolo: datos.simbolo,           // Ej: "$"
    nombre: datos.nombreDivisa,       // Ej: "Peso chileno"
    codigoISO: datos.codigoISO        // Ej: "CLP"
  };
}
