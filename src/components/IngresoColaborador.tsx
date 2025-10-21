import React, { useState } from "react";

type DatosColaborador = {
  nombreResponsable: string;
  institucion: string;
  pais: string;
  ciudad: string;
  correo: string;
};

function IngresoColaborador() {
  const [datos, setDatos] = useState<DatosColaborador>({
    nombreResponsable: "",
    institucion: "",
    pais: "",
    ciudad: "",
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
            Nombre de la institución:
            <input
              type="text"
              name="institucion"
              value={datos.institucion}
              onChange={handleChange}
            />
          </label>

          <label>
            País:
            <input
              type="text"
              name="pais"
              value={datos.pais}
              onChange={handleChange}
            />
          </label>

          <label>
            Ciudad:
            <input
              type="text"
              name="ciudad"
              value={datos.ciudad}
              onChange={handleChange}
            />
          </label>

          <label>
            Correo institucional:
            <input
              type="email"
              name="correo"
              value={datos.correo}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Registrarse</button>
        </form>
      ) : (
        <p>
          ¡Gracias por registrarte, {datos.nombreResponsable}! Tu institución{" "}
          <strong>{datos.institucion}</strong> ahora tiene acceso al panel de
          colaboradores.
        </p>
      )}
    </div>
  );
}

export default IngresoColaborador;
