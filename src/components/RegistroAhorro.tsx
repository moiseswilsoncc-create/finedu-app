import React, { useState, useEffect } from "react";

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

  const [logueado, setLogueado] = useState(false);
  const [grupoId, setGrupoId] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");

  useEffect(() => {
    const log = localStorage.getItem("logueado") === "true";
    const grupo = localStorage.getItem("grupoId") || "";
    const rol = localStorage.getItem("rolUsuario") || "";

    setLogueado(log);
    setGrupoId(grupo);
    setRolUsuario(rol);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegistro((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number(value) : value,
    }));
  };

  const registrar = () => {
    if (!grupoId) {
      alert("⚠️ No se ha definido el grupo. Puedes continuar en modo prueba.");
    }

    if (!registro.correo.trim() || registro.monto <= 0) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    // Simulación de envío
    console.log("Registrando ahorro:", {
      grupo_id: grupoId || "modo-prueba",
      ...registro,
      fecha: new Date().toISOString(),
    });

    alert("✅ Ahorro registrado correctamente.");
    setRegistro({ correo: "", monto: 0, tipo: "ingreso" });
  };

  if (!logueado) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h3>⚠️ Usuario no encontrado</h3>
        <p>No se encontraron datos financieros asociados a tu sesión. Por favor inicia sesión para registrar tus ingresos y egresos.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem" }}>
      <h2>💰 Registro de Ahorro</h2>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Correo del integrante:
        <input
          type="text"
          name="correo"
          value={registro.correo}
          onChange={handleChange}
          placeholder="ejemplo@correo.cl"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Monto en pesos chilenos:
        <input
          type="number"
          name="monto"
          value={registro.monto}
          onChange={handleChange}
          placeholder="Ej: 50000"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        Tipo de registro:
        <select
          name="tipo"
          value={registro.tipo}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        >
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </label>

      <button
        onClick={registrar}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Registrar
      </button>
    </div>
  );
};

export default RegistroAhorro;
