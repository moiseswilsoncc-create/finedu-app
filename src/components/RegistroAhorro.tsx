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
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAño, setFiltroAño] = useState("");

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
    if (!usuarioId || !monto) return;

    const fechaActual = new Date();
    const aporte = {
      usuario_id: usuarioId,
      monto: parseFloat(monto),
      fecha: fechaActual.toISOString(),
      mes: fechaActual.getMonth() + 1,
      año: fechaActual.getFullYear()
    };

    const { error } = await supabase.from("aportes_usuario").insert([aporte]);

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

  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return;

    const { error } = await supabase
      .from("aportes_usuario")
      .delete()
      .in("id", seleccionados);

    if (error) {
      console.error("Error al eliminar seleccionados:", error.message);
      setMensaje("❌ Error al eliminar seleccionados.");
    } else {
      setMensaje("✅ Aportes eliminados correctamente.");
      setSeleccionados([]);
      obtenerAportes();
      setTimeout(() => setMensaje(""), 3000);
    }
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

      {historialFiltrado.length > 0 ? (
        <>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            fontSize: "0.95rem"
          }}>
            <thead style={{ backgroundColor: "#f2f2f2" }}>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  <input type="checkbox" onChange={toggleSeleccionGlobal} />
                </th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Fecha</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Monto</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Mes</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Año</th>
              </tr>
            </thead>
            <tbody>
              {historialFiltrado.map((aporte) => (
                <tr key={aporte.id}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(aporte.id)}
                      onChange={() => toggleSeleccion(aporte.id)}
                    />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {new Date(aporte.fecha).toLocaleDateString()}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    ${aporte.monto.toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{aporte.mes}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{aporte.año}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={() => alert("Función de edición múltiple pendiente")}
              style={{
                backgroundColor: "#f39c12",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                cursor: "pointer"
              }}
            >
              ✏️ Editar seleccionado
            </button>

            <button
              onClick={eliminarSeleccionados}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                cursor: "pointer"
              }}
            >
              🗑️ Eliminar seleccionados
            </button>
          </div>

          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#2c3e50" }}>
            💰 Total: ${totalAhorrado.toLocaleString()}
          </p>
        </>
      ) : (
        <p style={{ marginTop: "1rem", color: "#888" }}>
          No hay aportes registrados aún.
        </p>
      )}

      <button
        style={{
          marginTop: "2rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#ccc",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
        onClick={() => window.location.href = "/panel-usuario"}
      >
        ⬅️ Volver al menú principal
      </button>
    </div>
  );
}

export default RegistroAhorro;
