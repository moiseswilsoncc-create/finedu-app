import React, { createContext, useContext, useState } from "react";

export type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type GrupoContextType = {
  nombreGrupoMeta: string;
  metaGrupal: number;
  participantes: Participante[];
  setGrupo: (nombre: string, meta: number) => void;
  setParticipantes: (lista: Participante[]) => void;
  actualizarParticipante: (nombre: string, ingresos: number, egresos: number) => void;
  resetGrupo: () => void;
  validoIntegrantes: boolean;        // ✅ nuevo
  mensajeValidacion: string;         // ✅ nuevo
};

const GrupoContext = createContext<GrupoContextType | undefined>(undefined);

export const GrupoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Grupo Finedu");
  const [metaGrupal, setMetaGrupal] = useState(1_000_000);
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  const setGrupo = (nombre: string, meta: number) => {
    setNombreGrupoMeta(nombre);
    setMetaGrupal(meta);
  };

  const actualizarParticipante = (nombre: string, ingresos: number, egresos: number) => {
    setParticipantes((prev) => {
      const existe = prev.find((p) => p.nombre === nombre);
      if (existe) {
        return prev.map((p) =>
          p.nombre === nombre ? { ...p, ingresos, egresos } : p
        );
      } else {
        return [...prev, { nombre, ingresos, egresos }];
      }
    });
  };

  const resetGrupo = () => {
    setNombreGrupoMeta("Grupo Finedu");
    setMetaGrupal(1_000_000);
    setParticipantes([]);
  };

  // ✅ Validación institucional de integrantes
  const count = participantes.length;
  let validoIntegrantes = true;
  let mensajeValidacion = "Integrantes válidos";

  if (count < 2) {
    validoIntegrantes = false;
    mensajeValidacion = "⚠️ El grupo debe tener al menos 2 integrantes (administrador + participante).";
  } else if (count > 100) {
    validoIntegrantes = false;
    mensajeValidacion = "⚠️ El grupo no puede tener más de 100 participantes.";
  }

  return (
    <GrupoContext.Provider
      value={{
        nombreGrupoMeta,
        metaGrupal,
        participantes,
        setGrupo,
        setParticipantes,
        actualizarParticipante,
        resetGrupo,
        validoIntegrantes,     // ✅ expuesto al formulario
        mensajeValidacion,     // ✅ expuesto al formulario
      }}
    >
      {children}
    </GrupoContext.Provider>
  );
};

export const useGrupo = (): GrupoContextType => {
  const context = useContext(GrupoContext);
  if (!context) {
    throw new Error("useGrupo debe usarse dentro de <GrupoProvider>");
  }
  return context;
};
