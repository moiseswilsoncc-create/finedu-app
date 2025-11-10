import React from "react";

interface Props {
  nombreGrupo: string;
  ciudad: string;
  comuna: string;
  pais: string;
  setNombreGrupo: (v: string) => void;
  setCiudad: (v: string) => void;
  setComuna: (v: string) => void;
  setPais: (v: string) => void;
}

const BloqueDatosGrupo: React.FC<Props> = ({
  nombreGrupo, ciudad, comuna, pais,
  setNombreGrupo, setCiudad, setComuna, setPais
}) => (
  <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
    <h3>📌 Datos generales del grupo</h3>

    <div style={{ marginBottom: "1rem" }}>
      <label>Nombre del grupo:</label>
      <input style={{ width: "100%" }} value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} />
    </div>

    <div style={{ marginBottom: "1rem" }}>
      <label>País:</label>
      <input style={{ width: "100%" }} value={pais} onChange={(e) => setPais(e.target.value)} />
    </div>

    <div style={{ marginBottom: "1rem" }}>
      <label>Ciudad:</label>
      <input style={{ width: "100%" }} value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
    </div>

    <div style={{ marginBottom: "1rem" }}>
      <label>Comuna:</label>
      <input style={{ width: "100%" }} value={comuna} onChange={(e) => setComuna(e.target.value)} />
    </div>
  </div>
);

export default BloqueDatosGrupo;
