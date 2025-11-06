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
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoItem, setNuevoItem] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [editando, setEditando] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("⚠️ No hay sesión activa.");
        return;
      }
      setUsuarioId(data.user.id);
      cargarCategorias(data.user.id);
      cargarEgresos(data.user.id);
    };
    getUser();
  }, []);

  const cargarCategorias = async (uid: string) => {
    const { data } = await supabase
      .from("categorias_egresos")
      .select("id, categoria")
      .eq("usuario_id", uid)
      .order("categoria", { ascending: true });
    if (data) setCategorias(data);
  };

  const cargarEgresos = async (uid: string) => {
    const { data } = await supabase
      .from("egresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });
    if (data) setEgresos(data);
  };

  const cargarItemsCategoria = async (cat: string) => {
    if (!usuarioId) return;
    const { data } = await supabase
      .from("items_egresos")
      .select("id, item")
      .eq("usuario_id", usuarioId)
      .eq("categoria", cat)
      .order("item", { ascending: true });
    if (data) setItemsCategoria(data);
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

    const { data } = await supabase
      .from("categorias_egresos")
      .insert([{ usuario_id: usuarioId, categoria: nombre }])
      .select("id, categoria");

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

    const { data } = await supabase
      .from("items_egresos")
      .insert([{ usuario_id: usuarioId, categoria, item: nombreItem }])
      .select("id, item");

    const nuevo = (data || [])[0];
    setItemsCategoria([nuevo, ...itemsCategoria]);
    setItem(nuevo.item);
    setNuevoItem("");
    setMensaje("✅ Ítem agregado.");
  };

  const handleEditarSeleccionado = () => {
    if (seleccionados.length === 1) {
      const egreso = egresos.find((i) => i.id === seleccionados[0]);
      if (egreso) {
        setEditando(egreso);
        setCategoria(egreso.categoria);
        setItem(egreso.item);
        setMensaje("✏️ Editando egreso seleccionado.");
      }
    } else {
      setError("Selecciona exactamente un egreso para editar.");
    }
  };

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
      <button onClick={() => window.location.href = "/"}>🔙 Volver al menú principal</button>

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

      <ListaEgresos
        egresos={egresos}
        seleccionados={seleccionados}
        toggleSeleccion={(id) =>
          setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
          )
        }
        handleEditarSeleccionado={handleEditarSeleccionado}
        handleEliminarSeleccionados={handleEliminarSeleccionados}
      />
    </div>
  );
};

export default Egresos;
