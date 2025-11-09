import React, { useState } from "react";
import RegistroAhorro from "./RegistroAhorro";
import PanelGrupo from "./PanelGrupo"; // ← vista colaborativa del grupo
import FormularioNuevoGrupo from "./FormularioNuevoGrupo"; // ← formulario institucional

const PanelAhorro: React.FC = () => {
  const [modo, setModo] = useState<"individual" | "grupal" | "crear">("individual");
  const correoUsuario = localStorage.getItem("correo") || "";

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>💼 Panel de Ahorro</h2>
      <p>Gestiona tus aportes personales, participa en grupos o crea uno nuevo.</p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label><strong>Modo:</strong> </label>
        <select value={modo} onChange={(e) => setModo(e.target.value as any)}>
          <option value="individual">Ahorro personal</option>
          <option value="grupal">Ahorro grupal</option>
          <option value="crear">Crear grupo de ahorro</option>
        </select>
      </div>

      {modo === "individual" && <RegistroAhorro />}
      {modo === "grupal" && <PanelGrupo />}
      {modo === "crear" && <FormularioNuevoGrupo />}
    </div>
  );
};

export default PanelAhorro;
