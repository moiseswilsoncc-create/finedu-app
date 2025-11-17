import React, { createContext, useContext, useState } from "react";
import { supabase } from "../supabaseClient"; // ✅ Import para consultas

// Tipado de participante institucional
export type Participante = {
  correo: string;       // ✅ siempre presente
  nombre: string;
  apellido: string;     // ✅ siempre presente
  ingresos: number;
  egresos: number;
};

// Tipado del contexto institucional
type GrupoContextType = {
  nombreGrupoMeta: string;
  metaGrupal: number;
  participantes: Participante[];
  setGrupo: (nombre: string, meta: number) => void;
  setParticipantes: (lista: Participante[]) => void;
  actualizarParticipante: (correo: string, ingresos: number, egresos: number) => Promise<void>;
  resetGrupo: () => void;
  validoIntegrantes: boolean;
  mensajeValidacion: string;
};

// ✅ Export explícito del contexto
export const GrupoContext = createContext<GrupoContextType | undefined>(undefined);

// ✅ Provider institucional
export const GrupoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Grupo Finedu");
  const [metaGrupal, setMetaGrupal] = useState(1_000_000);
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  const setGrupo = (nombre: string, meta: number) => {
    setNombreGrupoMeta(nombre);
    setMetaGrupal(meta);
  };

  // ✅ Busca nombre + apellido en Supabase y los guarda en el estado
  const actualizarParticipante = async (correo: string, ingresos: number, egresos: number) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("nombre, apellido")
      .eq("correo", correo)
      .single();

    if (error || !data) {
      console.error("No se encontró el usuario en la tabla usuarios:", error);
      return;
    }

    const nombreCompleto = data.nombre?.trim() || "";
    const apellidoCompleto = data.apellido?.trim() || "";

    setParticipantes((prev) => {
      const existe = prev.find((p) => p.correo === correo);
      if (existe) {
        return prev.map((p) =>
          p.correo === correo
            ? { ...p, nombre: nombreCompleto, apellido: apellidoCompleto, ingresos, egresos }
            : p
        );
      } else {
        return [
          ...prev,
          { correo, nombre: nombreCompleto, apellido: apellidoCompleto, ingresos, egresos },
        ];
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
        validoIntegrantes,
        mensajeValidacion,
      }}
    >
      {children}
    </GrupoContext.Provider>
  );
};

// ✅ Hook institucional para consumir el contexto
export const useGrupo = (): GrupoContextType => {
  const context = useContext(GrupoContext);
  if (!context) {
    throw new Error("useGrupo debe usarse dentro de <GrupoProvider>");
  }
  return context;
};
