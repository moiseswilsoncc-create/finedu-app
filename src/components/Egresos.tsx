// src/components/Egresos.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

interface Egreso {
  id: string;
  usuario_id: string;
  categoria: string;
  monto: number;
  fecha: string;
  descripcion?: string;
}

const Egresos: React.FC = () => {
  const categoriasBase = [
    "Alimentación",
    "Transporte",
    "Servicios básicos",
    "Crédito de consumo",
    "Tarjeta bancaria",
    "Tarjeta comercial",
    "Hipotecario",
    "Automotriz",
    "Personal (familiar, amigos)",
    "Entretenimiento",
    "Educación",
    "Salud"
  ];

  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [categoria, setCategoria] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [categoriasUsuario, setCategoriasUsuario] = useState<string[]>([]);
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [editando, setEditando] = useState<Egreso | null>(null);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("⚠️ No hay sesión activa.");
        return;
      }
      setUsuarioId(data.user.id);
      cargarEgresos(data.user.id);
      cargarCategoriasUsuario(data.user.id);
    };
    getUser();
  }, []);

  const cargarEgresos = async (uid: string) => {
    const { data, error } = await supabase
      .from("egresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });

    if (error) {
      setError("No se pudieron cargar los egresos.");
    } else {
      setEgresos(data || []);
    }
  };

  const cargarCategoriasUsuario = async (uid: string) => {
    const { data, error } = await supabase
      .from("categorias_egresos_usuario")
      .select("nombre")
      .eq("usuario_id", uid);

    if (!error && data) {
      setCategoriasUsuario(data.map((c: any) => c.nombre));
    }
  };

  const handleAgregarCategoria = async () => {
    if (!usuarioId) return;
    const nombre = nuevoTipo.trim();
    if (!nombre) return;

    if (categoriasBase.includes(nombre) || categoriasUsuario.includes(nombre)) {
      setError("⚠️ Esta categoría ya existe.");
      return;
    }

    const { data, error } = await supabase
      .from("categorias_egresos_usuario")
      .insert([{ usuario_id: usuarioId, nombre }])
      .select();

    if (error) {
      setError("No se pudo guardar la categoría.");
    } else {
      setMensaje("✅ Categoría agregada correctamente.");
      setCategoriasUsuario([...(data?.map((c: any) => c.nombre) || []), ...categoriasUsuario]);
      setNuevoTipo("");
    }
  };

  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!usuarioId) return;

    if (editando) {
      const cambios: any = {};
      if (monto !== "" && monto !== editando.monto) cambios.monto = Number(monto);
      if (fecha && fecha !== editando.fecha) cambios.fecha = fecha;
      if (descripcion && descripcion !== editando.descripcion) cambios.descripcion = descripcion;

      if (Object.keys(cambios).length === 0) {
        setMensaje("⚠️ No se detectaron cambios.");
        return;
      }

      const { error } = await supabase
        .from("egresos")
        .update(cambios)
        .eq("id", editando.id);

      if (error) {
        setError("No se pudo actualizar el egreso.");
      } else {
        setMensaje("✏️ Egreso actualizado correctamente.");
        setEgresos(
          egresos.map((i) =>
            i.id === editando.id ? { ...i, ...cambios } : i
          )
        );
        setEditando(null);
        setCategoria("");
        setMonto("");
        setFecha("");
        setDescripcion("");
        setSeleccionados([]); // limpiar selección
      }
    } else {
      if (!categoria || !monto || !fecha) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      const { data, error } = await supabase
        .from("egresos")
        .insert([{ usuario_id: usuarioId, categoria, monto: Number(monto), fecha, descripcion }])
        .select();

      if (error) {
        setError("No se pudo guardar el egreso.");
      } else {
        setMensaje("✅ Egreso agregado correctamente.");
        setEgresos([...(data || []), ...egresos]);
        setCategoria("");
        setMonto("");
        setFecha("");
        setDescripcion("");
      }
    }
  };
  // Filtros
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const aniosDisponibles = Array.from(
    new Set(egresos.map((e) => new Date(e.fecha).getFullYear()))
  ).sort();

  const toggleSeleccion = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((s) => s !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const handleEditarSeleccionado = () => {
    if (seleccionados.length === 1) {
      const egreso = egresos.find((i) => i.id === seleccionados[0]);
      if (egreso) {
        setEditando(egreso);
        setCategoria(egreso.categoria);
        setMonto(egreso.monto);
        setFecha(egreso.fecha);
        setDescripcion(egreso.descripcion || "");
        setMensaje("✏️ Editando egreso seleccionado.");
      }
    } else {
      setError("Debes seleccionar exactamente un egreso para editar.");
    }
  };

  const handleEliminarSeleccionados = async () => {
    if (seleccionados.length === 0) {
      setError("Debes seleccionar al menos un egreso para eliminar.");
      return;
    }

    const { error } = await supabase
      .from("egresos")
      .delete()
      .in("id", seleccionados);

    if (error) {
      setError("No se pudieron eliminar los egresos seleccionados.");
    } else {
      setEgresos(egresos.filter((i) => !seleccionados.includes(i.id)));
      setSeleccionados([]);
      setMensaje("🗑️ Egresos eliminados correctamente.");
    }
  };

  // Filtrar egresos por año y mes
  const egresosFiltrados = egresos.filter((e) => {
    const fechaObj = new Date(e.fecha);
    const anio = fechaObj.getFullYear().toString();
    const mes = (fechaObj.getMonth() + 1).toString();

    return (
      (filtroAnio ? anio === filtroAnio : true) &&
      (filtroMes ? mes === filtroMes : true)
    );
  });

  const total = egresosFiltrados.reduce((acc, e) => acc + e.monto, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <p>Registra y visualiza tus egresos agrupados por año y mes.</p>

      {/* Crear nueva categoría */}
      <div style={{ display: "flex", gap: "0.75rem", margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Nueva categoría (ej: Propina, Café)"
          value={nuevoTipo}
          onChange={(e) => setNuevoTipo(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button
          type="button"
          onClick={handleAgregarCategoria}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#16a085",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Agregar
        </button>
      </div>

      {/* Formulario de egreso */}
      <form onSubmit={handleGuardarEgreso} style={{ marginBottom: "1.5rem" }}>
        <div>
          <label>Elige tu egreso: </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            disabled={!!editando}
          >
            <option value="">-- Selecciona --</option>
            {[...categoriasBase, ...categoriasUsuario].map((c, i) => (
              <option key={i} value={c}>{c}</option>
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

        <div>
          <label>Descripción: </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Pago supermercado"
          />
        </div>

        <button type="submit">
          {editando ? "✏️ Guardar Cambios" : "➕ Agregar Egreso"}
        </button>
      </form>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Filtros */}
      <h3>Filtros</h3>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label>Año: </label>
          <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)}>
            <option value="">Todos</option>
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Mes: </label>
          <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
            <option value="">Todos</option>
            {meses.map((m, i) => (
              <option key={i} value={i+1}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de egresos filtrados */}
      <h3>📋 Lista de Egresos</h3>
      {egresosFiltrados.length === 0 ? (
        <p>No hay egresos registrados en este período.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>✔️</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {egresosFiltrados.map((e) => (
              <tr key={e.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(e.id)}
                    onChange={() => toggleSeleccion(e.id)}
                  />
                </td>
                <td>{e.categoria}</td>
                <td>${e.monto.toLocaleString("es-CL")}</td>
                <td>{e.fecha}</td>
                <td>{e.descripcion}</td>
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
        💵 Total del período: ${total.toLocaleString("es-CL")}
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

export default Egresos;
