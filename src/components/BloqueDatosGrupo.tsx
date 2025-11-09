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

    <label>Nombre del grupo:</label>
    <input value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} />

    <label>Ciudad:</label>
    <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} />

    <label>Comuna:</label>
    <input value={comuna} onChange={(e) => setComuna(e.target.value)} />

    <label>País:</label>
    <input value={pais} onChange={(e) => setPais(e.target.value)} />
  </div>
);

export default BloqueDatosGrupo;
