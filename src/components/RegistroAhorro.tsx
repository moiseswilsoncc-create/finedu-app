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
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState<Aporte[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAño, setFiltroAño] = useState("");

  const usuarioId = localStorage.getItem("usuarioId");

  useEffect(() => {
    obtenerAportes();
  }, [usuarioId]);

  const obtenerAportes = async () => {
    if (!usuarioId) return;

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
    if (!usuarioId || !monto) return;

    const fechaActual = new Date();
    const nuevoAporte = {
      usuario_id: usuarioId,
      monto: parseFloat(monto),
      fecha: fechaActual.toISOString(),
      mes: fechaActual.getMonth() + 1,
      año: fechaActual.getFullYear()
    };

    const { error } = await supabase.from("aportes_usuario").insert([nuevoAporte]);

    if (error) {
      console.error("Error al registrar aporte:", error.message);
      setMensaje("❌ Error al registrar aporte.");
    } else {
      setMonto("");
      setMensaje("✅ Aporte registrado correctamente.");
      setTimeout(() => setMensaje(""), 3000);
      obtenerAportes();
    }
  };

  const eliminarAporte = async (id: string) => {
    const { error } = await supabase
      .from("aportes_usuario")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar aporte:", error.message);
      return;
    }

    obtenerAportes();
  };

  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSeleccionGlobal = () => {
    if (seleccionados.length === historialFiltrado.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(historialFiltrado.map((a) => a.id));
    }
  };

  const historialFiltrado = historial.filter((a) => {
    const coincideMes = filtroMes ? a.mes === parseInt(filtroMes) : true;
    const coincideAño = filtroAño ? a.año === parseInt(filtroAño) : true;
    return coincideMes && coincideAño;
  });

  const totalAhorrado = historialFiltrado.reduce((sum, a) => sum + a.monto, 0);

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

      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
          <option value="">Todos los meses</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Mes {i + 1}
            </option>
          ))}
        </select>

        <select value={filtroAño} onChange={(e) => setFiltroAño(e.target.value)}>
          <option value="">Todos los años</option>
          {[2025, 2024, 2023].map((año) => (
            <option key={año} value={año}>{año}</option>
          ))}
        </select>
      </div>

      <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#2c3e50" }}>
        💰 Total ahorrado: ${totalAhorrado.toLocaleString()}
      </p>
