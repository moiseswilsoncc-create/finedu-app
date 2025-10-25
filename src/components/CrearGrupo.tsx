import React, { useState } from "react";

const CrearGrupo: React.FC<{ usuario: any }> = ({ usuario }) => {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [correos, setCorreos] = useState<string[]>([]);
  const [nuevoCorreo, setNuevoCorreo] = useState("");

  const agregarCorreo = () => {
    const correoLimpio = nuevoCorreo.trim().toLowerCase();
    if (correoLimpio && !correos.includes(correoLimpio)) {
      setCorreos([...correos, correoLimpio]);
      setNuevoCorreo("");
    }
  };

  const eliminarCorreo = (correo: string) => {
    setCorreos(correos.filter(c => c !== correo));
  };

  const crearGrupo = () => {
    if (!nombreGrupo.trim()) {
      alert("Debes ingresar un nombre para el grupo.");
      return;
    }

    const grupo = {
      nombre: nombreGrupo.trim(),
      administrador: usuario.correo,
      integrantes: [usuario.correo, ...correos],
      creadoEn: new Date().toISOString()
    };

    console.log("Grupo creado:", grupo);
    alert(`✅ Grupo "${grupo.nombre}" creado exitosamente. Eres el administrador.`);

    // Reset
    setNombreGrupo("");
    setCorreos([]);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🛠️ Crear nuevo grupo</h2>

      <label>
        Nombre del grupo:
        <input
          type="text"
          value={nombreGrupo}
          onChange={(e) => setNombreGrupo(e.target.value)}
          placeholder="Ej: Meta Familiar 2025"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
        />
      </label>

      <div style={{ marginTop: "1.5rem" }}>
        <label>
          Agregar integrante (correo):
          <input
            type="email"
            value={nuevoCorreo}
            onChange={(e) => setNuevoCorreo(e.target.value)}
            placeholder="Ej: persona@email.com"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </label>
        <button
          onClick={agregarCorreo}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#7f8c8d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ➕ Agregar integrante
        </button>
      </div>

      {correos.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4>👥 Integrantes agregados:</h4>
          <ul>
            {correos.map((correo, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                {correo}{" "}
                <button
                  onClick={() => eliminarCorreo(correo)}
                  style={{
                    marginLeft: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#c0392b",
                    cursor: "pointer"
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={crearGrupo}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2980b9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Crear grupo
      </button>
    </div>
  );
};

export default CrearGrupo;
