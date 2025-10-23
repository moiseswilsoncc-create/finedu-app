import React, { useState } from "react";

type Registro = {
  correo: string;
  monto: number;
  tipo: "ingreso" | "egreso";
};

const RegistroAhorro: React.FC = () => {
  const [registro, setRegistro] = useState<Registro>({
    correo: "",
    monto: 0,
    tipo: "ingreso",
  });

  const grupoId = localStorage.getItem("grupoId") || "";
  const rolUsuario = localStorage.getItem("rolUsuario") || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegistro({ ...registro, [name]: name === "monto" ? Number(value) : value });
  };

  const registrar = () => {
    if (!grupoId || rolUsuario !== "admin") {
      alert("Solo el administrador puede registrar ahorros.");
      return;
    }

    if (!registro.correo || registro.monto <= 0) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    // Simulación de envío
    console.log("Registrando ahorro:", {
      grupo_id: grupoId,
      ...registro,
      fecha: new Date().toISOString(),
    });

    alert("Ahorro registrado correctamente.");
    setRegistro({ correo: "", monto: 0, tipo: "ingreso" });
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem" }}>
      <h2>💰 Registro de Ahorro</h2>

      <input
        type="text"
        name="correo"
        placeholder="Correo del integrante"
        value={registro.correo}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />

      <input
        type="number"
        name="monto"
        placeholder="Monto en pesos chilenos"
        value={registro.monto}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />

      <select
        name="tipo"
        value={registro.tipo}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      >
        <option value="ingreso">Ingreso</option>
        <option value="egreso">Egreso</option>
      </select>

      <button onClick={registrar} style={{ padding: "0.5rem 1rem" }}>
        Registrar
      </button>
    </div>
  );
};

export default RegistroAhorro;
