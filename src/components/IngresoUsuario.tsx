import React, { useState } from "react";
import { DatosUsuario } from "../types";

type Props = {
  setPais: (pais: string) => void;
};

function IngresoUsuario({ setPais }: Props) {
  const [datos, setDatos] = useState<DatosUsuario>({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    pais: "",
    ciudad: "",
    comuna: "",
    correo: "",
  });

  const [registrado, setRegistrado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    if (name === "pais") setPais(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrado(true);
    // Aquí puedes enviar los datos al backend o almacenarlos en contexto
    console.log("Usuario registrado:", datos);
  };

  return (
    <div>
      <h3>Registro de usuario solicitante</h3>

      {!registrado ? (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} required />
          </label>

          <label>
            Apellido:
            <input type="text" name="apellido" value={datos.apellido} onChange={handleChange} required />
          </label>

          <label>
            Fecha de nacimiento:
            <input type="date" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={handleChange} required />
          </label>

          <label>
            País:
            <select name="pais" value={datos.pais} onChange={handleChange}>
              <option value="Chile">Chile</option>
              <option value="Perú">Perú</option>
              <option value="México">México</option>
              <option value="Colombia">Colombia</option>
            </select>
          </label>

          <label>
            Ciudad:
            <input type="text" name="ciudad" value={datos.ciudad} onChange={handleChange} required />
          </label>

          <label>
            Comuna:
            <input type="text" name="comuna" value={datos.comuna} onChange={handleChange} required />
          </label>

          <label>
            Correo electrónico:
            <input type="email" name="correo" value={datos.correo} onChange={handleChange} required />
          </label>

          <button type="submit">Registrarse</button>
        </form>
      ) : (
        <p>
          ¡Gracias por registrarte, {datos.nombre} {datos.apellido}! Tu perfil ha sido creado para operar desde{" "}
          <strong>{datos.ciudad}, {datos.comuna}</strong>.
        </p>
      )}
    </div>
  );
}

export default IngresoUsuario;
