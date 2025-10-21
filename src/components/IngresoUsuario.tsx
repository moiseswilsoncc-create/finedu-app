import React, { useState } from "react";
import { DatosUsuario } from "../types";

type Props = {
  setPais: (pais: string) => void;
};

function IngresoUsuario({ setPais }: Props) {
  const [datos, setDatos] = useState<DatosUsuario>({
    nombre: "",
    edad: 0,
    pais: "",
    ciudad: "",
    correo: "",
  });

  const [registrado, setRegistrado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: name === "edad" ? Number(value) : value });
    if (name === "pais") setPais(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrado(true);
  };

  return (
    <div>
      <h3>Registro de usuario solicitante</h3>

      {!registrado ? (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre completo:
            <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} />
          </label>

          <label>
            Edad:
            <input type="number" name="edad" value={datos.edad} onChange={handleChange} />
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
            Correo electrónico:
            <input type="email" name="correo" value={datos.correo} onChange={handleChange} />
          </label>

          <button type="submit">Registrarse</button>
        </form>
      ) : (
        <p>
          ¡Gracias por registrarte, {datos.nombre}! Tu perfil ha sido creado para operar desde{" "}
          <strong>{datos.pais}</strong>.
        </p>
      )}
    </div>
  );
}

export default IngresoUsuario;
