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
  const [editando, setEditando] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  // useEffect inicial
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

  // Funciones de carga
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
    if (!error && data) setItemsCategoria(data);
  };

  // Handlers
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
      setItemsCategoria([...(data as any[]), ...itemsCategoria]);
      setNuevoItem("");
      setMensaje("✅ Ítem agregado correctamente.");
    }
  };

  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    // … aquí va la lógica de guardar/editar egreso igual que antes
  };

  const toggleSeleccion = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((s) => s !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const handleEditarSeleccionado = () => {
    // … lógica de edición
  };

  const handleEliminarSeleccionados = async () => {
    // … lógica de eliminación
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <FormularioEgreso
        categorias={categorias}
        itemsCategoria={itemsCategoria}
        egresos={egresos}
        categoria={categoria}
        item={item}
        monto={monto}
        fecha={fecha}
        descripcion={descripcion}
        nuevoItem={nuevoItem}
        editando={editando}
        mensaje={mensaje}
        error={error}
        onAgregarItem={handleAgregarItem}
        onGuardar={handleGuardarEgreso}
        setCategoria={setCategoria}
        setItem={setItem}
        setMonto={setMonto}
        setFecha={setFecha}
        setDescripcion={setDescripcion}
        setNuevoItem={setNuevoItem}
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
