// src/components/BloqueDatosGrupo.tsx
import React from "react";
import { useUserPerfil } from "../context/UserContext"; // 👈 integración con UserContext

interface Props {
  nombreGrupo: string;
  pais: string;
  ciudad: string;
  comuna: string;
  setNombreGrupo: (v: string) => void;
  setPais: (v: string) => void;
  setCiudad: (v: string) => void;
  setComuna: (v: string) => void;
}

const BloqueDatosGrupo: React.FC<Props> = ({
  nombreGrupo,
  pais,
  ciudad,
  comuna,
  setNombreGrupo,
  setPais,
  setCiudad,
  setComuna,
}) => {
  const perfil = useUserPerfil(); // 👈 obtenemos nombre+apellido+correo

  return (
    <div
      style={{
        marginBottom: "2rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h3>📌 Datos generales del grupo</h3>

      {perfil && (
        <p style={{ fontWeight: "bold", color: "#2c3e50" }}>
          Administrador: {perfil.nombre} {perfil.apellido}
        </p>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label>Nombre del grupo:</label>
        <input
          style={{ width: "100%" }}
          value={nombreGrupo}
          onChange={(e) => setNombreGrupo(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>País:</label>
        <input
          style={{ width: "100%" }}
          value={pais}
          onChange={(e) => setPais(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Ciudad:</label>
        <input
          style={{ width: "100%" }}
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Comuna:</label>
        <input
          style={{ width: "100%" }}
          value={comuna}
          onChange={(e) => setComuna(e.target.value)}
        />
      </div>
    </div>
  );
};

export default BloqueDatosGrupo;
