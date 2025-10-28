// 📦 src/utils/getTasa.ts
// 🔄 Utilidad institucional para obtener la tasa financiera según país y tipo de producto

import { configFinanciera } from "../configFinanciera";

export function getTasa(
  pais: string,
  tipo: "consumo" | "auto" | "vivienda" | "inversion"
): number {
  const datos = configFinanciera[pais];

  if (!datos) {
    throw new Error(`❌ No se encontró información financiera para el país: ${pais}`);
  }

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
      throw new Error(`❌ Tipo de crédito inválido: ${tipo}`);
  }
}
