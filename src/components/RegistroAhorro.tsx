import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Aporte = {
  id: string;
  fecha: string;
  monto: number;
  mes: number;
  año: number;
};

function RegistroAhorro() {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState<Aporte[]>([]);

  useEffect(() => {
    const id = localStorage.getItem("usuarioId");
    setUsuarioId(id);
  }, []);

  useEffect(() => {
    if (usuarioId) obtenerAportes();
  }, [usuarioId]);

  const obtenerAportes = async () => {
    const { data, error } = await supabase
      .from("aportes_usuario")
      .select("id, fecha, monto, mes, año")
      .eq("usuario_id", usuarioId)
      .order("fecha", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error al obtener aportes:", error.message);
      return;
    }

    setHistorial(data || []);
  };

  const registrarAporte = async () => {
    if (!usuarioId || !monto) {
      console.warn("usuarioId o monto no definidos");
      return;
    }

    const fechaActual = new Date();
    const aporte = {
      usuario_id: usuarioId,
      monto: parseFloat(monto),
      fecha: fechaActual.toISOString(),
      mes: fechaActual.getMonth() + 1,
      año: fechaActual.getFullYear()
    };

    // 🧠 Trazabilidad cuántica
    console.log("🧩 usuarioId:", usuarioId);
    console.log("🧩 monto:", monto, "→ parseFloat:", parseFloat(monto));
    console.log("🧩 aporte:", aporte);

    const { error } = await supabase.from("aportes_usuario").insert([aporte]);

    if (error) {
      console.error("❌ Error Supabase:", error);
      setMensaje("❌ Error al registrar aporte.");
    } else {
      console.log("✅ Aporte registrado correctamente");
      setMonto("");
      setMensaje("✅ Aporte registrado correctamente.");
      setTimeout(() => setMensaje(""), 3000);
      obtenerAportes();
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>📘 Registro de ahorro</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto a registrar"
          style={{
            flex: 1,
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={registrarAporte}
          style={{
            padding: "0.6rem 1rem",
            backgroundColor: "#2980b9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Registrar
        </button>
      </div>

      {mensaje && (
        <p style={{ color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>
      )}

      {historial.length > 0 ? (
        <ul>
          {historial.map((a) => (
            <li key={a.id}>
              {new Date(a.fecha).toLocaleDateString()} — ${a.monto.toLocaleString()} (Mes {a.mes}, Año {a.año})
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: "1rem", color: "#888" }}>
          No hay aportes registrados aún.
        </p>
      )}
    </div>
  );
}

export default RegistroAhorro;
