import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FormularioEgreso from "./FormularioEgreso";
import ListaEgresos from "./ListaEgresos";

type Categoria = { id: string; categoria: string };
type ItemCat = { id: string; item: string };
type Egreso = {
  id: string;
  usuario_id: string;
  categoria: string;
  item: string;
  monto: number;
  fecha: string;
  descripcion?: string;
};

const Egresos: React.FC = () => {
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [itemsCategoria, setItemsCategoria] = useState<ItemCat[]>([]);

  const [categoria, setCategoria] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");

  const [nuevaCategoria, setNuevaCategoria] = useState<string>("");
  const [nuevoItem, setNuevoItem] = useState<string>("");

  const [mensaje, setMensaje] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [editando, setEditando] = useState<Egreso | null>(null);

  useEffect(() => {
    const getUserAndLoad = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setError("⚠️ No hay sesión activa.");
        return;
      }
      const uid = data.user.id;
      setUsuarioId(uid);
      await cargarCategorias(uid);
      await cargarEgresos(uid);
    };
    getUserAndLoad();
  }, []);

  const cargarCategorias = async (uid: string) => {
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("id, categoria")
      .eq("usuario_id", uid)
      .order("categoria", { ascending: true });
    if (error) { setError("Error cargando categorías."); return; }
    setCategorias((data || []) as Categoria[]);
  };

  const cargarEgresos = async (uid: string) => {
    const { data, error } = await supabase
      .from("egresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });
    if (error) { setError("Error cargando egresos."); return; }
    setEgresos((data || []) as Egreso[]);
  };

  const cargarItemsCategoria = async (cat: string) => {
    if (!usuarioId || !cat) { setItemsCategoria([]); return; }
    const { data, error } = await supabase
      .from("items_egresos")
      .select("id, item")
      .eq("usuario_id", usuarioId)
      .eq("categoria", cat)
      .order("item", { ascending: true });
    if (error) { setError("Error cargando ítems."); return; }
    setItemsCategoria((data || []) as ItemCat[]);
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
    if (existente && existente.length > 0) { setError("Categoría ya creada."); return; }

    const { data, error } = await supabase
      .from("categorias_egresos")
      .insert([{ usuario_id: usuarioId, categoria: nombre }])
      .select("id, categoria");
    if (error || !data?.length) { setError("No se pudo crear la categoría."); return; }

    const nueva = data[0] as Categoria;
    setCategorias([nueva, ...categorias]);
    setCategoria(nueva.categoria);
    setNuevaCategoria("");
    setMensaje("✅ Categoría agregada.");
    await cargarItemsCategoria(nueva.categoria);
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
    if (existente && existente.length > 0) { setError("Ítem ya creado."); return; }

    const { data, error } = await supabase
      .from("items_egresos")
      .insert([{ usuario_id: usuarioId, categoria, item: nombreItem }])
      .select("id, item");
    if (error || !data?.length) { setError("No se pudo crear el ítem."); return; }

    const nuevo = data[0] as ItemCat;
    setItemsCategoria([nuevo, ...itemsCategoria]);
    setItem(nuevo.item);
    setNuevoItem("");
    setMensaje("✅ Ítem agregado.");
  };

  const limpiarFormulario = () => {
    setCategoria("");
    setItem("");
    setMonto("");
    setFecha("");
    setDescripcion("");
    setEditando(null);
  };

  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(""); setError("");

    if (!usuarioId) { setError("⚠️ Sesión no válida."); return; }
    if (!categoria || !item || monto === "" || !fecha) {
      setError("Completa categoría, ítem, monto y fecha.");
      return;
    }

    if (editando) {
      const { error } = await supabase
        .from("egresos")
        .update({
          categoria,
          item,
          monto: Number(monto),
          fecha,
          descripcion: descripcion || null,
        })
        .eq("id", editando.id)
        .eq("usuario_id", usuarioId);
      if (error) { setError("No se pudo actualizar el egreso."); return; }

      setEgresos((prev) =>
        prev.map((e) =>
          e.id === editando.id
            ? { ...e, categoria, item, monto: Number(monto), fecha, descripcion }
            : e
        )
      );
      setMensaje("✏️ Egreso actualizado.");
      limpiarFormulario();
      return;
    }

    const { data, error } = await supabase
      .from("egresos")
      .insert([{
        usuario_id: usuarioId,
        categoria,
        item,
        monto: Number(monto),
        fecha,
        descripcion: descripcion || null,
      }])
      .select("*")
      .single();
    if (error || !data) { setError("No se pudo guardar el egreso."); return; }

    setEgresos((prev) => [data as Egreso, ...prev]);
    setMensaje("✅ Egreso agregado.");
    limpiarFormulario();
  };

  const handleEditarSeleccionado = async () => {
    setMensaje(""); setError("");
    if (seleccionados.length !== 1) {
      setError("Selecciona exactamente un egreso para editar.");
      return;
    }
    const egreso = egresos.find((i) => i.id === seleccionados[0]) || null;
    if (!egreso) { setError("Egreso no encontrado."); return; }

    setEditando(egreso);
    setCategoria(egreso.categoria);
    await cargarItemsCategoria(egreso.categoria);
    setItem(egreso.item);
    setMonto(egreso.monto);
    setFecha(egreso.fecha);
    setDescripcion(egreso.descripcion || "");
    setMensaje("✏️ Editando egreso seleccionado.");
  };

  const handleEliminarSeleccionados = async () => {
    setMensaje(""); setError("");
    if (seleccionados.length === 0) {
      setError("Selecciona al menos un egreso para eliminar.");
      return;
    }
    const { error } = await supabase
      .from("egresos")
      .delete()
      .in("id", seleccionados);
    if (error) { setError("No se pudieron eliminar."); return; }

    setEgresos((prev) => prev.filter((i) => !seleccionados.includes(i.id)));
    setSeleccionados([]);
    setMensaje("🗑️ Egresos eliminados.");
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
        descripcion={descripcion}
        nuevaCategoria={nuevaCategoria}
        nuevoItem={nuevoItem}
        editando={editando}
        mensaje={mensaje}
        error={error}
        onAgregarCategoria={handleAgregarCategoria}
        onAgregarItem={handleAgregarItem}
        onGuardar={handleGuardarEgreso}
        setCategoria={(val) => {
          setCategoria(val);
          cargarItemsCategoria(val);
        }}
        setItem={setItem}
        setMonto={setMonto}
        setFecha={setFecha}
        setDescripcion={setDescripcion}
        setNuevaCategoria={setNuevaCategoria}
        setNuevoItem={setNuevoItem}
        onCancelarEdicion={limpiarFormulario}
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

      <button
        style={{
          marginTop: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
        onClick={() => (window.location.href = "/")}
      >
        🔙 Volver al menú principal
      </button>
    </div>
  );
};

export default Egresos;
