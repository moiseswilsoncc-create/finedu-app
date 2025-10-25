import React, { useState } from "react";
import { DatosColaborador } from "../types";

type Props = {
  setPais: (pais: string) => void;
};

function IngresoColaborador({ setPais }: Props) {
  const [datos, setDatos] = useState<DatosColaborador>({
    nombreResponsable: "",
    institucion: "",
    pais: "",
    ciudad: "",
    correo: "",
  });

  const [registrado, setRegistrado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    if (name === "pais") setPais(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías agregar lógica para enviar los datos a una API
    setRegistrado(true);
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🏢 Registro de institución colaboradora</h3>

      {!registrado ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="text" name="nombreResponsable" placeholder="Nombre del responsable" value={datos.nombreResponsable} onChange={handleChange} />
          <input type="text" name="institucion" placeholder="Institución" value={datos.institucion} onChange={handleChange} />
          <input type="text" name="pais" placeholder="País" value={datos.pais} onChange={handleChange} />
          <input type="text" name="ciudad" placeholder="Ciudad" value={datos.ciudad} onChange={handleChange} />
          <input type="email" name="correo" placeholder="Correo institucional" value={datos.correo} onChange={handleChange} />
          <button type="submit" style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            Registrarse
          </button>
        </form>
      ) : (
        <p style={{ fontSize: "1.1rem", color: "#2ecc71" }}>
          ¡Gracias por registrarte, {datos.nombreResponsable}! Tu institución <strong>{datos.institucion}</strong> ha sido registrada en <strong>{datos.pais}</strong>.
        </p>
      )}
    </div>
  );
}

export default IngresoColaborador;
