import React, { useState, useEffect } from "react";
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
    clave: ""
  });

  const [registrado, setRegistrado] = useState(false);
  const [correoValido, setCorreoValido] = useState(true);
  const [camposCompletos, setCamposCompletos] = useState(false);
  const [claveValida, setClaveValida] = useState(true);

  const listaAutorizada = [
    "colaborador@finedu.cl",
    "institucion@finedu.cl",
    "admin@finedu.cl"
    // Puedes ampliar esta lista o conectarla a una API
  ];

  useEffect(() => {
    const todosCompletos = Object.values(datos).every(valor => valor.trim() !== "");
    setCamposCompletos(todosCompletos);
    setCorreoValido(listaAutorizada.includes(datos.correo));
    setClaveValida(datos.clave.length >= 8);
  }, [datos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    if (name === "pais") setPais(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (camposCompletos && correoValido && claveValida) {
      // Aquí podrías agregar lógica para enviar los datos a una API
      setRegistrado(true);
    }
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
          <input type="password" name="clave" placeholder="Clave temporal (mínimo 8 caracteres)" value={datos.clave} onChange={handleChange} />

          {!correoValido && (
            <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>
              Este correo no está autorizado por Finedu. Verifica con tu institución.
            </p>
          )}

          {!claveValida && (
            <p style={{ color: "#e74c3c", fontSize: "0.95rem" }}>
              La clave debe tener al menos 8 caracteres.
            </p>
          )}

          {!camposCompletos && (
            <p style={{ color: "#e67e22", fontSize: "0.95rem" }}>
              Por favor completa todos los campos antes de continuar.
            </p>
          )}

          <button type="submit" disabled={!camposCompletos || !correoValido || !claveValida} style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: (!camposCompletos || !correoValido || !claveValida) ? "#ccc" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: (!camposCompletos || !correoValido || !claveValida) ? "not-allowed" : "pointer"
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
