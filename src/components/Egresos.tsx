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

  // Cargar categorías
  const cargarCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("id, categoria")
      .order("categoria", { ascending: true });
    if (!error && data) setCategorias(data);
  };

  // Cargar egresos
  const cargarEgresos = async (uid: string) => {
    const { data, error } = await supabase
      .from("egresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });
    if (!error && data) setEgresos(data);
  };

  // Cargar ítems de una categoría
  const cargarItemsCategoria = async (cat: string) => {
    if (!usuarioId) return;
    const { data, error } = await supabase
      .from("items_egresos")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("categoria", cat);
    if (!error && data) setItemsCategoria(data);
  };

  // Agregar ítem
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

  // Guardar egreso (nuevo o edición)
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

  // Selección múltiple
  const toggleSeleccion = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((s) => s !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  // Editar seleccionado
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

  // Eliminar seleccionados
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
    
