// src/components/Egresos.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

interface Egreso {
  id: string;
  usuario_id: string;
  categoria: string;
  item: string;
  monto: number;
  fecha: string;
  descripcion?: string;
}

interface Categoria {
  id: string;
  categoria: string;
}

interface ItemCategoria {
  id: string;
  usuario_id: string;
  categoria: string;
  item: string;
}

const Egresos: React.FC = () => {
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoria, setCategoria] = useState("");
  const [item, setItem] = useState("");
  const [itemsCategoria, setItemsCategoria] = useState<ItemCategoria[]>([]);
  const [nuevoItem, setNuevoItem] = useState("");
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
      cargarCategorias();
      cargarEgresos(data.user.id);
    };
    getUser();
  }, []);

  const cargarCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("id, categoria")
      .order("categoria", { ascending: true });

    if (!error && data) setCategorias(data);
  };

  const cargarEgresos = async (uid: string) => {
    const { data, error } = await supabase
      .from("egresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });

    if (!error && data) setEgresos(data);
  };

  const cargarItemsCategoria = async (cat: string) => {
    if (!usuarioId) return;
    const { data, error } = await supabase
      .from("items_egresos")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("categoria", cat);

    if (!error && data) {
      setItemsCategoria(data);
    } else {
      setItemsCategoria([]);
    }
  };

  const handleAgregarItem = async () => {
    if (!usuarioId || !categoria || !nuevoItem.trim()) return;

    const { data: existente } = await supabase
      .from("items_egresos")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("categoria", categoria)
      .eq("item", nuevoItem.trim());

    if (existente && existente.length > 0) {
      setError("⚠️ Este ítem ya existe.");
      return;
    }

    const { data, error } = await supabase
      .from("items_egresos")
      .insert([{ usuario_id: usuarioId, categoria, item: nuevoItem.trim() }])
      .select();

    if (!error && data) {
      setItemsCategoria([...(data as ItemCategoria[]), ...itemsCategoria]);
      setNuevoItem("");
      setMensaje("✅ Ítem agregado correctamente.");
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
      if (item && item !== editando.item) cambios.item = item;

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
        setItem("");
        setMonto("");
        setFecha("");
        setDescripcion("");
        setSeleccionados([]);
      }
    } else {
      if (!categoria || !item || !monto || !fecha) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      const { data: existente } = await supabase
        .from("egresos")
        .select("*")
        .eq("usuario_id", usuarioId)
        .eq("categoria", categoria)
        .eq("item", item)
        .eq("fecha", fecha);

      if (existente && existente.length > 0) {
        setError("⚠️ Este egreso ya existe.");
        return;
      }

      const { data, error } = await supabase
        .from("egresos")
        .insert([{ usuario_id: usuarioId, categoria, item, monto: Number(monto), fecha, descripcion }])
        .select();

      if (error) {
        setError("No se pudo guardar el egreso.");
      } else {
        setMensaje("✅ Egreso agregado correctamente.");
        setEgresos([...(data || []), ...egresos]);
        setCategoria("");
        setItem("");
        setMonto("");
        setFecha("");
        setDescripcion("");
      }
    }
  };

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
        setItem(egreso.item);
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
  const total = egresos.reduce((acc, e) => acc + e.monto, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <p>Registra y visualiza tus egresos con categorías e ítems.</p>

      {/* Botones de acción inicial */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button
          type="button"
          onClick={() => {
            setEditando(null);
            setCategoria("");
            setItem("");
            setMonto("");
            setFecha("");
            setDescripcion("");
            setMensaje("➕ Preparado para agregar un egreso nuevo.");
          }}
        >
          ➕ Agregar nuevo egreso
        </button>

        <button
          type="button"
          onClick={() => {
            if (!categoria) {
              setError("Selecciona una categoría antes de agregar ítem.");
              return;
            }
            setMensaje("➕ Agrega un ítem nuevo en la categoría seleccionada.");
          }}
        >
          ➕ Agregar nuevo ítem
        </button>
      </div>

      {/* Selector de egresos registrados (para cargar uno y editar) */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Selecciona egreso registrado: </label>
        <select
          value={editando ? editando.id : ""}
          onChange={(e) => {
            const egresoSel = egresos.find((eg) => eg.id === e.target.value);
            if (egresoSel) {
              setEditando(egresoSel);
              setCategoria(egresoSel.categoria);
              setItem(egresoSel.item);
              setMonto(egresoSel.monto);
              setFecha(egresoSel.fecha);
              setDescripcion(egresoSel.descripcion || "");
              setMensaje("✏️ Egreso cargado para edición.");
            } else {
              setEditando(null);
            }
          }}
        >
          <option value="">-- Selecciona --</option>
          {egresos.map((eg) => (
            <option key={eg.id} value={eg.id}>
              {eg.categoria} — {eg.item} — ${eg.monto.toLocaleString("es-CL")}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario de egreso (flujo ordenado) */}
      <form onSubmit={handleGuardarEgreso} style={{ marginBottom: "1.5rem" }}>
        {/* Selector de categoría */}
        <div>
          <label>Elige tu categoría de egreso: </label>
          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              cargarItemsCategoria(e.target.value);
              setItem("");
            }}
            required
          >
            <option value="">-- Selecciona --</option>
            {categorias && categorias.map((c) => (
              <option key={c.id} value={c.categoria}>{c.categoria}</option>
            ))}
          </select>
        </div>

        {/* Selector global de ítems registrados dentro de la categoría */}
        {categoria && (
          <div style={{ marginTop: "1rem" }}>
            <label>Selecciona ítem dentro de {categoria}: </label>
            <select value={item} onChange={(e) => setItem(e.target.value)} required>
              <option value="">-- Selecciona --</option>
              {itemsCategoria && itemsCategoria.map((it) => (
                <option key={it.id} value={it.item}>{it.item}</option>
              ))}
            </select>

            {/* Agregar nuevo ítem */}
            <div style={{ marginTop: "0.5rem" }}>
              <input
                type="text"
                placeholder="Nuevo ítem (ej: Café, Verduras)"
                value={nuevoItem}
                onChange={(e) => setNuevoItem(e.target.value)}
              />
              <button type="button" onClick={handleAgregarItem}>➕ Agregar ítem</button>
            </div>
          </div>
        )}

        {/* Monto */}
        <div>
          <label>Monto: </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            placeholder="Ej: 50000"
            required
            min={0}
          />
        </div>

        {/* Fecha */}
        <div>
          <label>Fecha: </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        {/* Descripción */}
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
      {/* Lista de egresos */}
      <h3>📋 Lista de Egresos</h3>
      {egresos.length === 0 ? (
        <p>No hay egresos registrados aún.</p>
      ) : (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>✔️</th>
              <th>Categoría</th>
              <th>Ítem</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {egresos.map((e) => (
              <tr key={e.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(e.id)}
                    onChange={() => toggleSeleccion(e.id)}
                  />
                </td>
                <td>{e.categoria}</td>
                <td>{e.item}</td>
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

export default Egresos;
