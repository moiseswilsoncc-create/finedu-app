import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const supabaseUrl = "https://ftsbnorudtcyrrubutt.supabase.co";
const supabaseKey = "TU_API_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const EditarIngresosEgresos: React.FC = () => {
  const [ingresos, setIngresos] = useState<number>(0);
  const [egresos, setEgresos] = useState<number>(0);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const correo = localStorage.getItem("correo");

  useEffect(() => {
    const cargarDatos = async () => {
      if (!correo) {
        setMensaje("No se encontró el correo en la sesión.");
        return;
      }

      const { data, error } = await supabase
        .from("usuarios")
        .select("ingresos, egresos")
        .eq("correo", correo)
        .single();

      if (error || !data) {
        setMensaje("No se pudieron cargar tus datos.");
        return;
      }

      setIngresos(data.ingresos);
      setEgresos(data.egresos);
      setCargando(false);
    };

    cargarDatos();
  }, [correo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    const { error } = await supabase
      .from("usuarios")
      .update({ ingresos, egresos })
      .eq("correo", correo);

    if (error) {
      setMensaje("❌ Error al actualizar los datos.");
    } else {
      setMensaje("✅ Datos actualizados correctamente.");
    }
  };

  if (cargando) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3 style={{ color: "#2980b9" }}>⏳ Cargando datos...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "2rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>✏️ Editar ingresos y egresos</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <input
          type="number"
          value={ingresos}
          onChange={(e) => setIngresos(Number(e.target.value))}
          placeholder="Ingresos mensuales"
          required
          style={inputStyle}
        />
        <input
          type="number"
          value={egresos}
          onChange={(e) => setEgresos(Number(e.target.value))}
          placeholder="Egresos mensuales"
          required
          style={inputStyle}
        />
        <button type="submit" style={{ padding: "0.8rem", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer" }}>
          💾 Guardar cambios
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "1rem", textAlign: "center", color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

export default EditarIngresosEgresos;
