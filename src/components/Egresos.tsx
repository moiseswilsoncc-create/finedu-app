// src/components/Egresos.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FormularioEgreso from "./FormularioEgreso";
import ListaEgresos from "./ListaEgresos";

const Egresos: React.FC = () => {
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
      await cargarCategorias(data.user.id);
      await cargarEgresos(data.user.id);
    };
    getUser();
  }, []);

  const cargarCategorias = async (uid?: string) => {
    const id = uid || usuarioId;
    if (!id) return;
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("id, categoria")
      .eq("usuario_id", id)
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
    if (!usuarioId || !cat) {
      setItemsCategoria([]);
      return;
    }
    const { data, error } = await supabase
      .from("items_egresos")
      .select("id, item")
      .eq("usuario_id", usuarioId)
      .eq("categoria", cat)
      .order("item", { ascending: true });
    if (!error && data) setItemsCategoria(data);
  };

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

    if (error) { setError("No se pudo crear la categoría."); return; }

    const nueva = (data || [])[0];
    setCategorias([nueva, ...categorias]);
    setCategoria(nueva.categoria);               // dejar seleccionada
    setNuevaCategoria("");
    setMensaje("✅ Categoría agregada.");
    await cargarItemsCategoria(nueva.categoria); // preparar selector de ítems
  };

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
      .select("id, item");

    if (error) { setError("No se pudo crear el ítem."); return; }

    const nuevo = (data || [])[0];
    setItemsCategoria([nuevo, ...itemsCategoria]);
    setItem(nuevo.item);   // dejar seleccionado
    setNuevoItem("");
    setMensaje("✅ Ítem agregado.");
  };

  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("Por ahora, el guardado de egresos está deshabilitado.");
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
          cargarItemsCategoria(val); // conecta selector categoría → ítems
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
        toggleSeleccion={(id) =>
          setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
          )
        }
        handleEditarSeleccionado={() => {}}
        handleEliminarSeleccionados={() => {}}
      />
    </div>
  );
};

export default Egresos;
