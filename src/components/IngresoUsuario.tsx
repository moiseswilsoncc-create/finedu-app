import React, { useState } from "react";

type DatosUsuario = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  pais: string;
  ciudad: string;
  comuna: string;
  correo: string;
};

function IngresoUsuario() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrado(true);
    // Aquí podrías enviar los datos a una API o base de datos
  };

  return (
    <div>
      <h3>Registro de usuario</h3>

      {!registrado ? (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} />
          </label>

          <label>
            Apellido:
            <input type="text" name="apellido" value={datos.apellido} onChange={handleChange} />
          </label>

          <label>
            Fecha de nacimiento:
            <input type="date" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={handleChange} />
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
            Comuna:
            <input type="text" name="comuna" value={datos.comuna} onChange={handleChange} />
          </label>

          <label>
            Correo electrónico:
            <input type="email" name="correo" value={datos.correo} onChange={handleChange} />
          </label>

          <button type="submit">Registrarse</button>
        </form>
      ) : (
        <p>¡Gracias por registrarte, {datos.nombre}! Tu acceso a Finedu ha sido activado.</p>
      )}
    </div>
  );
}

export default IngresoUsuario;
