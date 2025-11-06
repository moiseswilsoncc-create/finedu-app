// src/components/Ingresos.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

interface Ingreso {
  id: string;
  usuario_id: string;
  tipo: string;
  monto: number;
  fecha: string;
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
  const [editando, setEditando] = useState<Ingreso | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("No hay sesión activa.");
        return;
      }
      setUsuarioId(data.user.id);
      cargarIngresos(data.user.id);
    };
    getUser();
  }, []);

  const cargarIngresos = async (uid: string) => {
    const { data, error } = await supabase
      .from("ingresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando ingresos:", error.message);
      setError("No se pudieron cargar los ingresos.");
    } else {
      setIngresos(data || []);
    }
  };

  const handleAgregarTipo = () => {
    if (nuevoTipo && !tiposDisponibles.includes(nuevoTipo)) {
      setTiposDisponibles([...tiposDisponibles, nuevoTipo]);
      setTipo(nuevoTipo);
      setNuevoTipo("");
    }
  };

  const handleGuardarIngreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!usuarioId || !tipo || !monto || !fecha) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (editando) {
      // Actualizar ingreso existente
      const { error } = await supabase
        .from("ingresos")
        .update({ tipo, monto: Number(monto), fecha })
        .eq("id", editando.id);

      if (error) {
        setError("No se pudo actualizar el ingreso.");
      } else {
        setMensaje("✏️ Ingreso actualizado correctamente.");
        setIngresos(
          ingresos.map((i) =>
            i.id === editando.id ? { ...i, tipo, monto: Number(monto), fecha } : i
          )
        );
        setEditando(null);
        setTipo("");
        setMonto("");
        setFecha("");
      }
    } else {
      // Insertar nuevo ingreso
      const { data, error } = await supabase
        .from("ingresos")
        .insert([{ usuario_id: usuarioId, tipo, monto: Number(monto), fecha }])
        .select();

      if (error) {
        setError("No se pudo guardar el ingreso.");
      } else {
        setMensaje("✅ Ingreso agregado correctamente.");
        setIngresos([...(data || []), ...ingresos]);
        setTipo("");
        setMonto("");
        setFecha("");
      }
    }
  };

  const handleEditarIngreso = (ingreso: Ingreso) => {
    setEditando(ingreso);
    setTipo(ingreso.tipo);
    setMonto(ingreso.monto);
    setFecha(ingreso.fecha);
  };

  const handleEliminarIngreso = async (id: string) => {
    const { error } = await supabase.from("ingresos").delete().eq("id", id);
    if (error) {
      setError("No se pudo eliminar el ingreso.");
    } else {
      setIngresos(ingresos.filter((i) => i.id !== id));
      setMensaje("🗑️ Ingreso eliminado correctamente.");
    }
  };

  const total = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📈 Ingresos</h2>
      <p>Registra y visualiza tus ingresos.</p>

      {/* Formulario */}
      <form onSubmit={handleGuardarIngreso} style={{ marginBottom: "1.5rem" }}>
        <div>
          <label>Tipo de ingreso: </label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">-- Selecciona --</option>
            {tiposDisponibles.map((t, index) => (
              <option key={index} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para agregar un nuevo tipo */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
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

        <button type="submit">
          {editando ? "✏️ Guardar Cambios" : "➕ Agregar Ingreso"}
        </button>
      </form>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista de ingresos */}
      <h3>📋 Lista de Ingresos</h3>
      {ingresos.length === 0 ? (
        <p>No hay ingresos registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso.id}>
                <td>{ingreso.tipo}</td>
                <td>${ingreso.monto.toLocaleString("es-CL")}</td>
                <td>{ingreso.fecha}</td>
                <td>
                  <button onClick={() => handleEditarIngreso(ingreso)}>✏️ Editar</button>
                  <button onClick={() => handleEliminarIngreso(ingreso.id)}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Total */}
      <h4 style={{ marginTop: "1rem" }}>
        💵 Total: ${total.toLocaleString("es-CL")}
      </h4>

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
