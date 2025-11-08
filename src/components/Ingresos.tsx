import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

interface Ingreso {
  id: string;
  usuario_id: string;
  tipo: string;
  monto: number;
  fecha: string;
  mes?: string;
  anio?: number;
}

const Ingresos: React.FC = () => {
  const [tipo, setTipo] = useState("");
  const [tiposDisponibles, setTiposDisponibles] = useState<string[]>([
    "Sueldo",
    "Boletas de honorarios",
    "Aguinaldo",
    "Mesada",
    "Ingreso cumpleaños"
  ]);
  const [nuevoTipo, setNuevoTipo] = useState("");

  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [editando, setEditando] = useState<Ingreso | null>(null);

  const [mesFiltro, setMesFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("No hay sesión activa.");
        return;
      }
      setUsuarioId(data.user.id);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (usuarioId) {
      cargarIngresos(usuarioId);
    }
  }, [usuarioId, mesFiltro, anioFiltro, tipoFiltro]);

  const cargarIngresos = async (uid: string) => {
    let query = supabase
      .from("ingresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });

    if (mesFiltro) query = query.eq("mes", mesFiltro);
    if (anioFiltro) query = query.eq("anio", Number(anioFiltro));
    if (tipoFiltro) query = query.eq("tipo", tipoFiltro);

    const { data, error } = await query;

    if (error) {
      console.error("Error cargando ingresos:", error.message);
      setError("No se pudieron cargar los ingresos.");
    } else {
      setIngresos(data || []);
    }
  };
  };

  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleEditarSeleccionado = () => {
    if (seleccionados.length === 1) {
      const ingreso = ingresos.find((i) => i.id === seleccionados[0]);
      if (ingreso) {
        setEditando(ingreso);
        setTipo(ingreso.tipo);
        setMonto(ingreso.monto);
        setFecha(ingreso.fecha);
        setMensaje("✏️ Editando ingreso seleccionado.");
      }
    } else {
      setError("Debes seleccionar exactamente un ingreso para editar.");
    }
  };

  const handleEliminarSeleccionados = async () => {
    if (seleccionados.length === 0) {
      setError("Debes seleccionar al menos un ingreso para eliminar.");
      return;
    }

    const { error } = await supabase
      .from("ingresos")
      .delete()
      .in("id", seleccionados);

    if (error) {
      setError("No se pudieron eliminar los ingresos seleccionados.");
    } else {
      setIngresos(ingresos.filter((i) => !seleccionados.includes(i.id)));
      setSeleccionados([]);
      setMensaje("🗑️ Ingresos eliminados correctamente.");
    }
  };

  const total = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📈 Ingresos</h2>
      <p>Registra y visualiza tus ingresos.</p>

      {/* Formulario */}
      <form onSubmit={handleGuardarIngreso} style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="Agregar nuevo tipo (ej: Propina)"
            value={nuevoTipo}
            onChange={(e) => setNuevoTipo(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={handleAgregarTipo}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#16a085",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            ➕ Tipo
          </button>
        </div>

        <div>
          <label>Elige tu ingreso: </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            disabled={!!editando}
          >
            <option value="">-- Selecciona --</option>
            {tiposDisponibles.map((t, index) => (
              <option key={index} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Monto: </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            placeholder="Ej: 50000"
          />
        </div>

        <div>
          <label>Fecha: </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <button type="submit">
          {editando ? "✏️ Guardar Cambios" : "💾 Guardar Ingreso"}
        </button>
      </form>

      {/* Filtros */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <label>Mes</label>
          <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
            <option value="">Todos</option>
            {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Año</label>
          <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}>
            <option value="">Todos</option>
            {["2023", "2024", "2025"].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Tipo</label>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="">Todos</option>
            {tiposDisponibles.map((t, index) => (
              <option key={index} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de ingresos */}
      <h3>📋 Lista de Ingresos</h3>
      {ingresos.length === 0 ? (
        <p>No hay ingresos registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>✔️</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(ingreso.id)}
                    onChange={() => toggleSeleccion(ingreso.id)}
                  />
                </td>
                <td>{ingreso.tipo}</td>
                <td>${ingreso.monto.toLocaleString("es-CL")}</td>
                <td>{ingreso.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Acciones globales */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleEditarSeleccionado}>✏️ Editar seleccionado</button>
        <button onClick={handleEliminarSeleccionados}>🗑️ Eliminar seleccionados</button>
      </div>

      {/* Total */}
      <h4 style={{ marginTop: "1rem" }}>
        💵 Total: ${total.toLocaleString("es-CL")}
      </h4>

      {/* Mensajes */}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Botón volver */}
      <Link
        to="/panel-usuario"
        style={{
          display: "inline-block",
          marginTop: "1.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#3498db",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none"
        }}
      >
        ⬅️ Volver al menú principal
      </Link>
    </div>
  );
};

export default Ingresos;
