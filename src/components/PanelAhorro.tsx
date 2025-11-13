// src/components/PanelAhorro.tsx
import React, { useState, useEffect } from "react";
import RegistroAhorro from "./RegistroAhorro";
import PanelGrupo from "./PanelGrupo";
import CrearGrupo from "./CrearGrupo"; // ✅ Componente institucionalizado
import { useUserPerfil } from "../context/UserContext"; // 👈 integración con UserContext

const PanelAhorro: React.FC = () => {
  const [modo, setModo] = useState<"individual" | "grupal" | "crear">("individual");
  const perfil = useUserPerfil(); // 👈 obtenemos nombre+apellido+correo

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
      {perfil && (
        <p style={{ fontWeight: "bold", color: "#2c3e50" }}>
          Usuario activo: {perfil.nombre} {perfil.apellido}
        </p>
      )}
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
      {modo === "crear" && perfil?.correo ? (
        <CrearGrupo usuario={{ correo: perfil.correo }} />
      ) : (
        <p style={{ color: "#999" }}>No se puede crear grupo sin usuario activo.</p>
      )}
    </div>
  );
};

export default PanelAhorro;
