import React, { createContext, useContext } from "react";

// 📊 Datos simulados institucionales para visualización y análisis
const datosSimulados = {
  ahorroTotal: 128_000_000,
  ahorroMensual: 8_200_000,
  variacionMensual: 6.2,
  tendenciaAhorro: [7_200_000, 7_600_000, 7_800_000, 8_000_000, 8_200_000, 8_400_000],
  usuariosActivos: 1245,
  usuariosConAhorro: 842,
  usuariosConSimulacion: 516,
  usuariosConMetaCumplida: 312,
  usuariosConEgresosAltos: 198,

  segmentacionEdad: [
    ["18–25 años", "22%", "$85.000"],
    ["26–35 años", "34%", "$120.000"],
    ["36–50 años", "28%", "$145.000"],
    ["51+ años", "16%", "$110.000"],
  ],

  segmentacionSexo: [
    ["Mujeres", "58%", "$132.000"],
    ["Hombres", "42%", "$118.000"],
  ],

  simuladores: [
    ["Crédito consumo", 312, "+6.2%"],
    ["Crédito automotriz", 104, "-2.1%"],
    ["Crédito vivienda", 78, "+12.5%"],
    ["Inversión", 122, "+9.8%"],
  ],

  distribucionGeografica: {
    tabla: [
      ["Metropolitana", "$6.200.000", 520],
      ["Valparaíso", "$1.800.000", 160],
      ["Biobío", "$1.500.000", 140],
      ["Otras regiones", "$2.500.000", 425],
    ],
    mapa: [], // 🔧 pendiente para mapa de calor
  },

  retencion: [
    ["Nuevos grupos este mes", 42],
    ["Tasa de retención", "78%"],
  ],

  crecimientoGrupal: [
    ["Crecimiento promedio por grupo", "+11.3%"],
  ],

  analisisConversacional: {
    instituciones: [
      ["BancoEstado", 124, 78, 14, "+18%"],
      ["Santander", 97, 62, 21, "+12%"],
      ["Caja Los Andes", 84, 66, 6, "+9%"],
      ["Falabella", 76, 41, 18, "-4%"],
    ],
    temas: [
      ["Créditos de consumo", 212, 134, 42, "+6.2%"],
      ["Ahorro para vivienda", 148, 112, 9, "+12.5%"],
      ["Deuda con retail", 96, 28, 54, "-2.1%"],
      ["Fondos mutuos", 74, 61, 3, "+9.8%"],
      ["Educación financiera", 88, 76, 2, "+7.3%"],
    ],
    preguntas: [
      ["¿Cuál es el mejor banco para abrir una cuenta de ahorro?"],
      ["¿Cómo puedo salir de DICOM?"],
      ["¿Qué crédito tiene menor interés?"],
      ["¿Conviene invertir en fondos mutuos o APV?"],
      ["¿Cómo funciona el crédito hipotecario?"],
    ],
    sentimiento: [
      ["Positivo", "62%", "+4.2%"],
      ["Neutro", "28%", "-1.1%"],
      ["Negativo", "10%", "-3.1%"],
    ],
  },

  estadisticasAvanzadas: {
    indices: [
      ["Índice de vulnerabilidad financiera", "16.2%"],
      ["Índice de activación temprana", "63%"],
      ["Índice de cohesión grupal", "72%"],
    ],
    correlaciones: [
      ["Simulación → Ahorro", "+28% probabilidad"],
      ["Test financiero → Meta cumplida", "+18% correlación"],
    ],
    proyecciones: [
      ["Grupos en camino a cumplir meta", 38],
      ["Usuarios que alcanzarían su meta", "46%"],
    ],
  },
};

const FineduContext = createContext(datosSimulados);

export const useDatosFinedu = () => useContext(FineduContext);

export const FineduProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <FineduContext.Provider value={datosSimulados}>
      {children}
    </FineduContext.Provider>
  );
};
