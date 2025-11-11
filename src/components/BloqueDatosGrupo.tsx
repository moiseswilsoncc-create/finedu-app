import React from "react";

interface Props {
  nombreGrupo: string;
  setNombreGrupo: (v: string) => void;
}

const BloqueDatosGrupo: React.FC<Props> = ({ nombreGrupo, setNombreGrupo }) => (
  <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
    <h3>📌 Datos generales del grupo</h3>

    <div style={{ marginBottom: "1rem" }}>
      <label>Nombre del grupo:</label>
      <input
        style={{ width: "100%" }}
        value={nombreGrupo}
        onChange={(e) => setNombreGrupo(e.target.value)}
      />
    </div>
  </div>
);

export default BloqueDatosGrupo;
