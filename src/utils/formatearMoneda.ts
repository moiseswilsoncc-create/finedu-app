import { configFinanciera } from "../configFinanciera"

export function formatearMoneda(valor: number, pais: string): string {
  const datos = configFinanciera[pais]

  if (!datos) {
    throw new Error(`No se encontró configuración financiera para el país: ${pais}`)
  }

  const formato = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: datos.moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formato.format(valor).replace(datos.moneda, datos.simbolo)
}

