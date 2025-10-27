import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import SimuladorCredito from "./SimuladorCredito";

type Grupo = {
  id: string;
  nombre: string;
  estado: string; // "activo" o "inactivo"
  integrantes: number;
};

function RegistroAhorro() {
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [paisUsuario, setPaisUsuario] = useState("Chile");

  useEffect(() => {
    const obtenerGrupo = async () => {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) return;

      const { data, error } = await supabase
        .from("grupos_financieros")
        .select("id, nombre, estado, integrantes")
        .eq("usuario_id", usuarioId)
        .single();

      if (error) {
        console.error("Error al obtener grupo:", error.message);
        return;
      }

      setGrupo(data);
    };

    obtenerGrupo();
  }, []);

  const grupoActivo = grupo?.estado === "activo";

  return (
    <div>
      <h2>Registro de ahorro</h2>

      {/* Aquí iría tu lógica de registro de aportes */}

      <SimuladorCredito pais={paisUsuario} grupoActivo={grupoActivo} />
    </div>
  );
}

export default RegistroAhorro;
