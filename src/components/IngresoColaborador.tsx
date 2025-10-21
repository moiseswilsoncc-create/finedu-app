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
    setRegistrado(true);
  };

  return (
    <div>
      <h3>Registro de institución colaboradora</h3>

      {!registrado ? (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre del responsable:
            <input
              type="text"
              name="nombreResponsable"
              value={datos.nombreResponsable}
              onChange={handleChange}
            />
          </label>

          <label>
            Institución:
            <input
              type="text"
              name="institucion"
              value={datos.institucion}
              onChange={handleChange}
            />
          </label>

          <label>
            País:
            <input type="text" name="pais" value={datos.pais} onChange={handleChange} />
          </label>

          <label>
            Ciudad:
            <input type="text" name="ciudad" value={datos.ciudad} onChange={handleChange} />
          </label>

          <label>
            Correo institucional:
            <input type="email" name="correo" value={datos.correo} onChange={handleChange} />
          </label>

          <button type="submit">Registrarse</button>
        </form>
      ) : (
        <p>
          ¡Gracias por registrarte, {datos.nombreResponsable}! Tu institución{" "}
          <strong>{datos.institucion}</strong> ha sido registrada en <strong>{datos.pais}</strong>.
        </p>
      )}
    </div>
  );
}

export default IngresoColaborador;
