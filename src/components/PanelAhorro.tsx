// src/components/PanelAhorro.tsx
import React, { useState, useEffect } from "react";
import RegistroAhorro from "./RegistroAhorro";
import PanelGrupo from "./PanelGrupo";
import CrearGrupo from "./CrearGrupo"; // ✅ Componente institucionalizado

interface Props {
  usuario: {
    correo: string;
  };
}

const PanelAhorro: React.FC<Props> = ({ usuario }) => {
  const [modo, setModo] = useState<"individual" | "grupal" | "crear">("individual");

  // Recuperar modo guardado
  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoAhorro");
    if (modoGuardado === "individual" || modoGuardado === "grupal" || modoGuardado === "crear") {
      setModo(modoGuardado);
    }
  }, []);

  // Guardar modo seleccionado
  useEffect(() => {
    localStorage.setItem("modoAhorro", modo);
  }, [modo]);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>💼 Panel de Ahorro</h2>
      <p>Gestiona tus aportes personales, participa en grupos o crea uno nuevo.</p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="modo"><strong>Modo:</strong> </label>
        <select
          id="modo"
          value={modo}
          onChange={(e) => setModo(e.target.value as "individual" | "grupal" | "crear")}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="individual">Ahorro personal</option>
          <option value="grupal">Ahorro grupal</option>
          <option value="crear">Crear grupo de ahorro</option>
        </select>
      </div>

      {modo === "individual" && <RegistroAhorro />}
      {modo === "grupal" && <PanelGrupo />}
      {modo === "crear" && usuario?.correo ? (
        <CrearGrupo usuario={{ correo: usuario.correo }} />
      ) : (
        <p style={{ color: "#999" }}>No se puede crear grupo sin correo de usuario.</p>
      )}
    </div>
  );
};

export default PanelAhorro;
