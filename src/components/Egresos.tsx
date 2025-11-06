// src/components/Egresos.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FormularioEgreso from "./FormularioEgreso";

const Egresos: React.FC = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [itemsCategoria, setItemsCategoria] = useState<any[]>([]);
  const [categoria, setCategoria] = useState("");
  const [item, setItem] = useState("");
  const [nuevoItem, setNuevoItem] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("⚠️ No hay sesión activa.");
        return;
      }
      setUsuarioId(data.user.id);
      cargarCategorias(data.user.id);
    };
    getUser();
  }, []);

  const cargarCategorias = async (uid: string) => {
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("id, categoria")
      .eq("usuario_id", uid)
      .order("categoria", { ascending: true });
    if (!error && data) setCategorias(data);
  };

  const cargarItemsCategoria = async (cat: string) => {
    if (!usuarioId) return;
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
    if (!usuarioId || !nuevaCategoria.trim()) return;
    const nombre = nuevaCategoria.trim();

    const { data: existente } = await supabase
      .from("categorias_egresos")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("categoria", nombre);

    if (existente && existente.length > 0) {
      setError("⚠️ Categoría ya creada.");
      return;
    }

    const { data, error } = await supabase
      .from("categorias_egresos")
      .insert([{ usuario_id: usuarioId, categoria: nombre }])
      .select("id, categoria");

    if (error) { setError("No se pudo crear la categoría."); return; }

    const nueva = (data || [])[0];
    setCategorias([nueva, ...categorias]);
    setCategoria(nueva.categoria);
    setNuevaCategoria("");
    setMensaje("✅ Categoría agregada.");
    await cargarItemsCategoria(nueva.categoria);
  };

  const handleAgregarItem = async () => {
    setMensaje(""); setError("");
    if (!usuarioId || !categoria || !nuevoItem.trim()) return;
    const nombreItem = nuevoItem.trim();

    const { data: existente } = await supabase
      .from("items_egresos")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("categoria", categoria)
      .eq("item", nombreItem);

    if (existente && existente.length > 0) {
      setError("⚠️ Ítem ya creado.");
      return;
    }

    const { data, error } = await supabase
      .from("items_egresos")
      .insert([{ usuario_id: usuarioId, categoria, item: nombreItem }])
      .select("id, item");

    if (error) { setError("No se pudo crear el ítem."); return; }

    const nuevo = (data || [])[0];
    setItemsCategoria([nuevo, ...itemsCategoria]);
    setItem(nuevo.item);
    setNuevoItem("");
    setMensaje("✅ Ítem agregado.");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <FormularioEgreso
        categorias={categorias}
        itemsCategoria={itemsCategoria}
        categoria={categoria}
        item={item}
        nuevaCategoria={nuevaCategoria}
        nuevoItem={nuevoItem}
        mensaje={mensaje}
        error={error}
        onAgregarCategoria={handleAgregarCategoria}
        onAgregarItem={handleAgregarItem}
        setCategoria={(val) => {
          setCategoria(val);
          cargarItemsCategoria(val);
        }}
        setItem={setItem}
        setNuevaCategoria={setNuevaCategoria}
        setNuevoItem={setNuevoItem}
      />
    </div>
  );
};

export default Egresos;
