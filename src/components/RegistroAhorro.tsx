import React, { useState, useEffect } from "react";

type Registro = {
  correo: string;
  monto: number;
  tipo: string;
};

const RegistroAhorro: React.FC = () => {
  const [registro, setRegistro] = useState<Registro>({
    correo: "",
    monto: 0,
    tipo: "ahorro",
  });

  const [sesionValida, setSesionValida] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [grupoId, setGrupoId] = useState("");

  useEffect(() => {
    const logueado = localStorage.getItem("logueado") === "true";
    const correo = localStorage.getItem("correoUsuario") || "";
    const grupo = localStorage.getItem("grupoId") || "";

    setSesionValida(logueado && correo !== "");
    setCorreoUsuario(correo);
    setGrupoId(grupo);

    setRegistro({
      correo: correo,
      monto: 0,
      tipo: "ahorro",
    });

    if (correo) {
      obtenerNombreDesdeCorreo(correo);
    }
  }, []);

  const obtenerNombreDesdeCorreo = async (correo: string) => {
    try {
      const response = await fetch(
        `https://ftsbnorudtcyrrubutt.supabase.co/rest/v1/usuarios?correo=eq.${correo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: "TU_API_KEY",
            Authorization: "Bearer TU_API_KEY",
          },
        }
      );

      const data = await response.json();
      if (data.length > 0 && data[0].nombre) {
        setNombreUsuario(data[0].nombre);
      } else {
        setNombreUsuario("Usuario");
      }
    } catch (err) {
      console.error("Error al obtener nombre:", err);
      setNombreUsuario("Usuario");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistro((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number(value) : value,
    }));
  };

  const registrar = () => {
    if (!registro.correo.trim() || registro.monto <= 0) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    console.log("Registrando ahorro:", {
      grupo_id: grupoId || "modo-individual",
      ...registro,
      fecha: new Date().toISOString(),
    });

    alert(`✅ ${nombreUsuario}, tu aporte de ahorro fue registrado correctamente.`);
    setRegistro({ correo: correoUsuario, monto: 0, tipo: "ahorro" });
  };

  if (!sesionValida) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h3>⚠️ Usuario no encontrado</h3>
        <p>No se encontraron datos financieros asociados a tu sesión. Por favor inicia sesión para registrar tus ahorros.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem" }}>
      <h2>💰 Registro de Ahorro</h2>
      <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
        👤 <strong>{nombreUsuario}</strong>, registra tus aportes de ahorro personal o grupal.
      </p>

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

      <button
        onClick={registrar}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        Registrar ahorro
      </button>
    </div>
  );
};

export default RegistroAhorro;
