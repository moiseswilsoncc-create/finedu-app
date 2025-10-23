import React, { createContext, useContext, useState } from "react";

type Participante = {
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
};

const GrupoContext = createContext<GrupoContextType | undefined>(undefined);

export const GrupoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Grupo Finedu");
  const [metaGrupal, setMetaGrupal] = useState(1000000);
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

  return (
    <GrupoContext.Provider
      value={{
        nombreGrupoMeta,
        metaGrupal,
        participantes,
        setGrupo,
        setParticipantes,
        actualizarParticipante,
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
