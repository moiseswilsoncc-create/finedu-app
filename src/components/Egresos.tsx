import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import FormularioEgreso from "./FormularioEgreso";
import ListaEgresos from "./ListaEgresos";

interface Egreso {
  id: string;
  usuario_id: string;
  item_id: number;
  item_nombre: string;
  categoria_nombre: string;
  monto: number;
  fecha: string;
  descripcion?: string;
}

const Egresos: React.FC = () => {
  // Estados principales
  const [categoria, setCategoria] = useState("");
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);
  const [nuevoCategoria, setNuevoCategoria] = useState("");

  const [item, setItem] = useState("");
  const [itemsDisponibles, setItemsDisponibles] = useState<string[]>([]);
  const [nuevoItem, setNuevoItem] = useState("");

  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [editando, setEditando] = useState<Egreso | null>(null);

  // 🔹 Filtros adicionales (se pasarán a ListaEgresos)
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [itemFiltro, setItemFiltro] = useState("");
  const [montoMin, setMontoMin] = useState<number | "">("");
  const [montoMax, setMontoMax] = useState<number | "">("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("No hay sesión activa.");
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
      .select("nombre");

    if (error) {
      setError(error.message);
      return;
    }
    setCategoriasDisponibles(data?.map((c: any) => c.nombre) || []);
  };

  const cargarItems = async (catNombre: string) => {
    const { data: catData, error: catError } = await supabase
      .from("categorias_egresos")
      .select("id")
      .eq("nombre", catNombre)
      .single();

    if (catError || !catData) {
      setError("No se encontró la categoría en Supabase.");
      return;
    }

    const categoriaId = catData.id;
    const { data, error } = await supabase
      .from("items_egresos")
      .select("nombre")
      .eq("categoria_id", categoriaId);

    if (error) {
      setError(error.message);
      return;
    }
    setItemsDisponibles(data?.map((i: any) => i.nombre) || []);
  };

  const handleAgregarCategoria = async () => {
    const nombre = nuevoCategoria.trim();
    if (!nombre) return;

    const { error } = await supabase.from("categorias_egresos").insert([
      { nombre, usuario_id: usuarioId }
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    setCategoriasDisponibles([...categoriasDisponibles, nombre]);
    setCategoria(nombre);
    setNuevoCategoria("");
    setMensaje("✅ Categoría agregada.");
    await cargarItems(nombre);
  };

  const handleEditarCategoria = async (nombre: string) => {
    const nuevoNombre = prompt("Nuevo nombre de la categoría:", nombre);
    if (!nuevoNombre) return;

    const { error } = await supabase
      .from("categorias_egresos")
      .update({ nombre: nuevoNombre })
      .eq("nombre", nombre)
      .eq("usuario_id", usuarioId);

    if (error) setError(error.message);
    else {
      setMensaje("✏️ Categoría actualizada.");
      cargarCategorias();
    }
  };

  const handleEliminarCategoria = async (nombre: string) => {
    const { error } = await supabase
      .from("categorias_egresos")
      .delete()
      .eq("nombre", nombre)
      .eq("usuario_id", usuarioId);

    if (error) setError(error.message);
    else {
      setMensaje("🗑️ Categoría eliminada.");
      cargarCategorias();
    }
  };
  const handleAgregarItem = async () => {
    if (!categoria) return;

    const { data: catData } = await supabase
      .from("categorias_egresos")
      .select("id")
      .eq("nombre", categoria)
      .single();

    if (!catData) return;
    const categoriaId = catData.id;
    const nombreItem = nuevoItem.trim();
    if (!nombreItem) return;

    const { error } = await supabase.from("items_egresos").insert([
      { categoria_id: categoriaId, nombre: nombreItem, usuario_id: usuarioId }
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    setItemsDisponibles([...itemsDisponibles, nombreItem]);
    setItem(nombreItem);
    setNuevoItem("");
    setMensaje("✅ Ítem agregado.");
  };

  const handleEditarItem = async (nombre: string) => {
    const nuevoNombre = prompt("Nuevo nombre del ítem:", nombre);
    if (!nuevoNombre) return;

    const { error } = await supabase
      .from("items_egresos")
      .update({ nombre: nuevoNombre })
      .eq("nombre", nombre)
      .eq("usuario_id", usuarioId);

    if (error) setError(error.message);
    else {
      setMensaje("✏️ Ítem actualizado.");
      cargarItems(categoria);
    }
  };

  const handleEliminarItem = async (nombre: string) => {
    const { error } = await supabase
      .from("items_egresos")
      .delete()
      .eq("nombre", nombre)
      .eq("usuario_id", usuarioId);

    if (error) setError(error.message);
    else {
      setMensaje("🗑️ Ítem eliminado.");
      cargarItems(categoria);
    }
  };

  const cargarEgresos = async (uid: string) => {
    let query = supabase
      .from("egresos")
      .select(`
        id,
        usuario_id,
        monto,
        fecha,
        descripcion,
        items_egresos (
          nombre,
          categorias_egresos (nombre)
        )
      `)
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });

    // 🔹 Filtros adicionales
    if (categoriaFiltro) query = query.eq("categoria_id", categoriaFiltro);
    if (itemFiltro) query = query.eq("item_id", itemFiltro);
    if (montoMin !== "" && montoMin !== undefined) query = query.gte("monto", montoMin);
    if (montoMax !== "" && montoMax !== undefined) query = query.lte("monto", montoMax);

    const { data, error } = await query;
    if (error) {
      setError(error.message);
      return;
    }

    const egresosConNombres = data.map((e: any) => ({
      id: e.id,
      usuario_id: e.usuario_id,
      monto: e.monto,
      fecha: e.fecha,
      descripcion: e.descripcion,
      item_nombre: e.items_egresos?.nombre || "",
      categoria_nombre: e.items_egresos?.categorias_egresos?.nombre || ""
    }));

    setEgresos(egresosConNombres);
  };

  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || !categoria || !item || !monto || !fecha) return;

    const { data: itemData } = await supabase
      .from("items_egresos")
      .select("id")
      .eq("nombre", item)
      .single();

    if (!itemData) return;
    const itemId = itemData.id;

    if (editando) {
      const cambios: any = {
        item_id: itemId,
        monto: Number(monto),
        fecha,
        descripcion
      };
      await supabase.from("egresos").update(cambios).eq("id", editando.id);
      setMensaje("✏️ Egreso actualizado.");
      setEditando(null);
      limpiarFormulario();
      await cargarEgresos(usuarioId);
    } else {
      await supabase.from("egresos").insert([{
        usuario_id: usuarioId,
        item_id: itemId,
        monto: Number(monto),
        fecha,
        descripcion
      }]);
      setMensaje("✅ Egreso agregado.");
      limpiarFormulario();
      await cargarEgresos(usuarioId);
    }
  };

  const limpiarFormulario = () => {
    setCategoria("");
    setItem("");
    setMonto("");
    setFecha("");
    setDescripcion("");
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
      const egreso = egresos.find((e) => e.id === seleccionados[0]);
      if (egreso) {
        setEditando(egreso);
        setCategoria(egreso.categoria_nombre);
        setItem(egreso.item_nombre);
        setMonto(egreso.monto);
        setFecha(egreso.fecha);
        setDescripcion(egreso.descripcion || "");
      }
    }
  };

  const handleEliminarSeleccionados = async () => {
    if (!usuarioId || seleccionados.length === 0) return;
    await supabase.from("egresos").delete().in("id", seleccionados);
    setEgresos(egresos.filter((e) => !seleccionados.includes(e.id)));
    setSeleccionados([]);
    setMensaje("🗑️ Egresos eliminados.");
  };

  const total = egresos.reduce((acc, egreso) => acc + egreso.monto, 0);

  // Render
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>

      {/* 🔹 Filtros adicionales para la tabla */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div>
          <label>Categoría:</label>
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
            <option value="">Todas</option>
            {categoriasDisponibles.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Ítem:</label>
          <select value={itemFiltro} onChange={(e) => setItemFiltro(e.target.value)}>
            <option value="">Todos</option>
            {itemsDisponibles.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Monto entre:</label>
          <input
            type="number"
            placeholder="mín"
            value={montoMin}
            onChange={(e) => setMontoMin(Number(e.target.value))}
            style={{ width: "6rem" }}
          />
          <input
            type="number"
            placeholder="máx"
            value={montoMax}
            onChange={(e) => setMontoMax(Number(e.target.value))}
            style={{ width: "6rem", marginLeft: "0.5rem" }}
          />
        </div>

        <button
          type="button"
          onClick={() => usuarioId && cargarEgresos(usuarioId)}
          style={{ alignSelf: "flex-end" }}
        >
          🔍 Filtrar
        </button>
      </div>
      {/* Formulario con acciones */}
      <FormularioEgreso
        categoria={categoria}
        categoriasDisponibles={categoriasDisponibles}
        nuevoCategoria={nuevoCategoria}
        item={item}
        itemsDisponibles={itemsDisponibles}
        nuevoItem={nuevoItem}
        monto={monto}
        fecha={fecha}
        descripcion={descripcion}
        editando={editando}
        mensaje={mensaje}
        error={error}
        setCategoria={setCategoria}
        setNuevoCategoria={setNuevoCategoria}
        setItem={setItem}
        setNuevoItem={setNuevoItem}
        setMonto={setMonto}
        setFecha={setFecha}
        setDescripcion={setDescripcion}
        onAgregarCategoria={handleAgregarCategoria}
        onAgregarItem={handleAgregarItem}
        onGuardar={handleGuardarEgreso}
        onSeleccionarCategoria={(cat) => cargarItems(cat)}
        onEditarCategoria={handleEditarCategoria}
        onEliminarCategoria={handleEliminarCategoria}
        onEditarItem={handleEditarItem}
        onEliminarItem={handleEliminarItem}
      />

      {/* Lista de egresos */}
      <ListaEgresos
        egresos={egresos}
        seleccionados={seleccionados}
        toggleSeleccion={toggleSeleccion}
        handleEditarSeleccionado={handleEditarSeleccionado}
        handleEliminarSeleccionados={handleEliminarSeleccionados}
        total={total}
      />
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
