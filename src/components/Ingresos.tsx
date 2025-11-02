import React, { useState } from "react";

interface Ingreso {
  usuario: string;
  tipo: string;
  monto: number;
  fecha: string;
}

const Ingresos: React.FC = () => {
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);

  // Obtenemos el usuario desde localStorage (ejemplo)
  const usuario = localStorage.getItem("correoUsuario") || "usuario_demo";

  const handleAgregarIngreso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !monto || !fecha) return;

    const nuevoIngreso: Ingreso = {
      usuario,
      tipo,
      monto: Number(monto),
      fecha,
    };

    setIngresos([...ingresos, nuevoIngreso]);

    // limpiar inputs
    setTipo("");
    setMonto("");
    setFecha("");
  };

  const total = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📈 Ingresos</h2>
      <p>Registra y visualiza tus ingresos.</p>

      {/* Formulario */}
      <form onSubmit={handleAgregarIngreso} style={{ marginBottom: "1.5rem" }}>
        <div>
          <label>Tipo de ingreso: </label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">-- Selecciona --</option>
            <option value="Sueldo">Sueldo</option>
            <option value="Boletas de honorarios">Boletas de honorarios</option>
            <option value="Mesada">Mesada</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div>
          <label>Monto: </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            placeholder="Ej: 50000"
            required
          />
        </div>

        <div>
          <label>Fecha: </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <button type="submit">➕ Agregar Ingreso</button>
      </form>

      {/* Lista de ingresos */}
      <h3>📋 Lista de Ingresos</h3>
      {ingresos.length === 0 ? (
        <p>No hay ingresos registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso, index) => (
              <tr key={index}>
                <td>{ingreso.usuario}</td>
                <td>{ingreso.tipo}</td>
                <td>${ingreso.monto.toLocaleString("es-CL")}</td>
                <td>{ingreso.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Total */}
      <h4 style={{ marginTop: "1rem" }}>
        💵 Total: ${total.toLocaleString("es-CL")}
      </h4>
    </div>
  );
};

export default Ingresos;
