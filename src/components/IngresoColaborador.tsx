import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function IngresoColaborador() {
  const [datos, setDatos] = useState({
    nombreResponsable: "",
    institucion: "",
    pais: "Chile",
    ciudad: "",
    correo: "",
    clave: ""
  });

  const [registrado, setRegistrado] = useState(false);
  const [correoValido, setCorreoValido] = useState(true);
  const [camposCompletos, setCamposCompletos] = useState(false);
  const [claveValida, setClaveValida] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const todosCompletos = Object.values(datos).every(valor => valor.trim() !== "");
    setCamposCompletos(todosCompletos);
    setClaveValida(datos.clave.length >= 8);
  }, [datos]);

  useEffect(() => {
    const validarCorreo = async () => {
      if (!datos.correo) return;
      const { data, error } = await supabase
        .from("correos_autorizados")
        .select("correo")
        .eq("correo", datos.correo)
        .single();

      setCorreoValido(!!data && !error);
    };

    validarCorreo();
  }, [datos.correo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!camposCompletos || !correoValido || !claveValida) return;

    try {
      // Hashing de clave (si no existe endpoint, usar directamente la clave temporal)
      let claveHasheada = datos.clave;
      try {
        const response = await fetch("/api/hash-clave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clave: datos.clave })
        });
        const json = await response.json();
        if (json?.claveHasheada) claveHasheada = json.claveHasheada;
      } catch {
        console.warn("⚠️ No se encontró endpoint /api/hash-clave, usando clave en texto plano (solo para pruebas).");
      }

      // 1. Insertar en colaboradores
      const { data: colaboradoresData, error: errorColaboradores } = await supabase
        .from("colaboradores")
        .insert([
          {
            nombreResponsable: datos.nombreResponsable,
            institucion: datos.institucion,
            pais: datos.pais,
            ciudad: datos.ciudad,
            correo: datos.correo,
            clave: claveHasheada,
            fechaRegistro: new Date().toISOString()
          }
        ])
        .select();

      if (errorColaboradores || !colaboradoresData || !colaboradoresData[0]?.id) {
        setError("❌ No se pudo registrar el colaborador.");
        return;
      }

      const nuevoColaborador = colaboradoresData[0];

      // 2. Insertar en colaboradores_activos
      const { error: errorActivos } = await supabase
        .from("colaboradores_activos")
        .insert([
          {
            colaborador_id: nuevoColaborador.id,
            correo: datos.correo,
            nombre: datos.nombreResponsable,
            institucion: datos.institucion,
            pais: datos.pais,
            activo: true,
            fecha_activacion: new Date().toISOString()
          }
        ]);

      if (errorActivos) {
        setError("❌ Error al registrar la activación del colaborador.");
        return;
      }

      setRegistrado(true);
    } catch (err) {
      console.error("❌ Error general:", err);
      setError("Error de conexión con Supabase.");
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

          {!correoValido && <p style={{ color: "#e74c3c" }}>Este correo no está autorizado por Finedu.</p>}
          {!claveValida && <p style={{ color: "#e74c3c" }}>La clave debe tener al menos 8 caracteres.</p>}
          {!camposCompletos && <p style={{ color: "#e67e22" }}>Completa todos los campos antes de continuar.</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

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
