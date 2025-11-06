// src/components/Egresos.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FormularioEgreso from "./FormularioEgreso";
import ListaEgresos from "./ListaEgresos";

const Egresos: React.FC = () => {
  // Estados principales
  const [egresos, setEgresos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [itemsCategoria, setItemsCategoria] = useState<any[]>([]);
  const [categoria, setCategoria] = useState("");
  const [item, setItem] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nuevoItem, setNuevoItem] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editando, setEditando] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

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

  // Cargar categorías (todas del usuario)
  const cargarCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("id, categoria")
      .eq("usuario_id", usuarioId)
      .order("categoria", { ascending: true });
    if (!error && data) setCategorias(data);
  };

  // Cargar egresos (para lista y edición)
  const cargarEgresos = async (uid: string) => {
    const { data, error } = await supabase
      .from("egresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });
    if (!error && data) setEgresos(data);
  };

  // Cargar ítems de una categoría para el selector
  const cargarItemsCategoria = async (cat: string) => {
    if (!usuarioId || !cat) {
      setItemsCategoria([]);
      return;
    }
    const { data, error } = await supabase
      .from("items_egresos")
      .select("id, item, categoria")
      .eq("usuario_id", usuarioId)
      .eq("categoria", cat)
      .order("item", { ascending: true });
    if (!error && data) setItemsCategoria(data);
  };

  // Agregar categoría (evita duplicados y actualiza selector)
  const handleAgregarCategoria = async () => {
    setMensaje(""); setError("");
    if (!usuarioId) { setError("⚠️ Sesión no válida."); return; }
    const nombre = nuevaCategoria.trim();
    if (!nombre) { setError("Ingresa un nombre de categoría."); return; }

    const { data: existente, error: errSel } = await supabase
      .from("categorias_egresos")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("categoria", nombre);

    if (errSel) { setError("Error verificando categoría."); return; }
    if (existente && existente.length > 0) {
      setError("Categoría ya creada.");
      return;
    }

    const { data, error } = await supabase
      .from("categorias_egresos")
      .insert([{ usuario_id: usuarioId, categoria: nombre }])
      .select("id, categoria");

    if (error) {
      setError("No se pudo crear la categoría.");
      return;
    }

    // Persistir y reflejar en UI
    const nueva = (data || [])[0];
    setCategorias([nueva, ...categorias]);
    setCategoria(nueva.categoria);           // dejar seleccionada
    setNuevaCategoria("");
    setMensaje("✅ Categoría agregada.");
    await cargarItemsCategoria(nueva.categoria); // preparar selector de ítems
  };

  // Agregar ítem (evita duplicados y actualiza selector)
  const handleAgregarItem = async () => {
    setMensaje(""); setError("");
    if (!usuarioId) { setError("⚠️ Sesión no válida."); return; }
    if (!categoria) { setError("Selecciona una categoría primero."); return; }
    const nombreItem = nuevoItem.trim();
    if (!nombreItem) { setError("Ingresa un nombre de ítem."); return; }

    const { data: existente, error: errSel } = await supabase
      .from("items_egresos")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("categoria", categoria)
      .eq("item", nombreItem);

    if (errSel) { setError("Error verificando ítem."); return; }
    if (existente && existente.length > 0) {
      setError("Ítem ya creado.");
      return;
    }

    const { data, error } = await supabase
      .from("items_egresos")
      .insert([{ usuario_id: usuarioId, categoria, item: nombreItem }])
      .select("id, item, categoria");

    if (error) {
      setError("No se pudo crear el ítem.");
      return;
    }

    const nuevo = (data || [])[0];
    setItemsCategoria([nuevo, ...itemsCategoria]);
    setItem(nuevo.item);       // dejar seleccionado
    setNuevoItem("");
    setMensaje("✅ Ítem agregado.");
  };
  // Guardar egreso (por ahora deshabilitado según tu instrucción)
  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("Por ahora, el guardado de egresos está deshabilitado.");
    setMensaje("");
  };

  // Selección múltiple (para ListaEgresos)
  const toggleSeleccion = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((s) => s !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  // Editar seleccionado (carga estados)
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
        cargarItemsCategoria(egreso.categoria);
      }
    } else {
      setError("Selecciona exactamente un egreso para editar.");
    }
  };

  // Eliminar seleccionados
  const handleEliminarSeleccionados = async () => {
    if (seleccionados.length === 0) {
      setError("Selecciona al menos un egreso para eliminar.");
      return;
    }
    const { error } = await supabase
      .from("egresos")
      .delete()
      .in("id", seleccionados);
    if (error) {
      setError("No se pudieron eliminar.");
    } else {
      setEgresos(egresos.filter((i) => !seleccionados.includes(i.id)));
      setSeleccionados([]);
      setMensaje("🗑️ Egresos eliminados.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <FormularioEgreso
        categorias={categorias}
        itemsCategoria={itemsCategoria}
        categoria={categoria}
        item={item}
        monto={monto}
        fecha={fecha}
        nuevoItem={nuevoItem}
        nuevaCategoria={nuevaCategoria}
        editando={editando}
        mensaje={mensaje}
        error={error}
        onAgregarCategoria={handleAgregarCategoria}
        onAgregarItem={handleAgregarItem}
        onGuardar={handleGuardarEgreso}
        setCategoria={(val) => {
          setCategoria(val);
          cargarItemsCategoria(val); // conexión selector categoría → ítems
        }}
        setItem={setItem}
        setMonto={setMonto}
        setFecha={setFecha}
        setDescripcion={setDescripcion}
        setNuevoItem={setNuevoItem}
        setNuevaCategoria={setNuevaCategoria}
        cargarItemsCategoria={cargarItemsCategoria}
      />
      <ListaEgresos
        egresos={egresos}
        seleccionados={seleccionados}
        toggleSeleccion={toggleSeleccion}
        handleEditarSeleccionado={handleEditarSeleccionado}
        handleEliminarSeleccionados={handleEliminarSeleccionados}
      />
    </div>
  );
};

export default Egresos;
