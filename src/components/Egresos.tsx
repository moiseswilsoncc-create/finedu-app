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

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("No hay sesión activa.");
        return;
      }
      setUsuarioId(data.user.id);
      cargarCategorias(data.user.id);
      cargarEgresos(data.user.id);
    };
    getUser();
  }, []);

  const cargarCategorias = async (uid: string) => {
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("nombre")
      .eq("usuario_id", uid);

    if (error) {
      console.error("Error al cargar categorías:", error.message);
      setError(error.message);
      return;
    }

    setCategoriasDisponibles(data?.map((c: any) => c.nombre) || []);
  };

  const cargarItems = async (uid: string, catNombre: string) => {
    const { data: catData, error: catError } = await supabase
      .from("categorias_egresos")
      .select("id")
      .eq("usuario_id", uid)
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
      .eq("usuario_id", uid)
      .eq("categoria_id", categoriaId);

    if (error) {
      console.error("Error al cargar ítems:", error.message);
      setError(error.message);
      return;
    }

    setItemsDisponibles(data?.map((i: any) => i.nombre) || []);
  };
  const cargarEgresos = async (uid: string) => {
    const { data, error } = await supabase
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

    if (error) {
      console.error("Error al cargar egresos:", error.message);
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

  const handleAgregarCategoria = async () => {
    setError(""); setMensaje("");
    if (!usuarioId) { setError("No hay sesión activa."); return; }

    const nombre = nuevoCategoria.trim();
    if (!nombre) { setError("Ingresa un nombre de categoría."); return; }
    if (categoriasDisponibles.includes(nombre)) {
      setError("⚠️ La categoría ya existe.");
      return;
    }

    const { error } = await supabase.from("categorias_egresos").insert([
      { usuario_id: usuarioId, nombre }
    ]);

    if (error) {
      console.error("Error Supabase:", error.message);
      setError("Error al crear categoría: " + error.message);
      return;
    }

    setCategoriasDisponibles([...categoriasDisponibles, nombre]);
    setCategoria(nombre);
    setNuevoCategoria("");
    setMensaje("✅ Categoría agregada.");
    await cargarItems(usuarioId, nombre);
  };

  const handleAgregarItem = async () => {
    setError(""); setMensaje("");
    if (!usuarioId) { setError("No hay sesión activa."); return; }
    if (!categoria) { setError("Selecciona una categoría."); return; }

    // Buscar id de la categoría
    const { data: catData, error: catError } = await supabase
      .from("categorias_egresos")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("nombre", categoria)
      .single();

    if (catError || !catData) {
      setError("No se encontró la categoría en Supabase.");
      return;
    }

    const categoriaId = catData.id;
    const nombreItem = nuevoItem.trim();

    if (!nombreItem) { setError("Ingresa un nombre de ítem."); return; }
    if (itemsDisponibles.includes(nombreItem)) {
      setError("⚠️ El ítem ya existe en esta categoría.");
      return;
    }

    const { error } = await supabase.from("items_egresos").insert([
      { usuario_id: usuarioId, categoria_id: categoriaId, nombre: nombreItem }
    ]);

    if (error) {
      console.error("Error Supabase:", error.message);
      setError("Error al crear ítem: " + error.message);
      return;
    }

    setItemsDisponibles([...itemsDisponibles, nombreItem]);
    setItem(nombreItem);
    setNuevoItem("");
    setMensaje("✅ Ítem agregado.");
  };

  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMensaje("");
    if (!usuarioId) { setError("No hay usuario válido."); return; }

    if (!categoria || !item || !monto || !fecha) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Buscar id del ítem
    const { data: itemData, error: itemError } = await supabase
      .from("items_egresos")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("nombre", item)
      .single();

    if (itemError || !itemData) {
      setError("No se encontró el ítem en Supabase.");
      return;
    }

    const itemId = itemData.id;

    if (editando) {
      const cambios: any = {
        item_id: itemId,
        monto: Number(monto),
        fecha,
        descripcion
      };

      const { error } = await supabase.from("egresos").update(cambios).eq("id", editando.id);
      if (error) {
        console.error("Error Supabase:", error.message);
        setError("No se pudo actualizar el egreso: " + error.message);
        return;
      }

      setMensaje("✏️ Egreso actualizado.");
      setEgresos(egresos.map((e) => (e.id === editando.id ? { ...e, ...cambios } : e)));
      setEditando(null);
      limpiarFormulario();
    } else {
      const { data, error } = await supabase
        .from("egresos")
        .insert([{
          usuario_id: usuarioId,
          item_id: itemId,
          monto: Number(monto),
          fecha,
          descripcion
        }])
        .select();

      if (error) {
        console.error("Error Supabase:", error.message);
        setError("No se pudo guardar el egreso: " + error.message);
        return;
      }

      setMensaje("✅ Egreso agregado.");
      await cargarEgresos(usuarioId);
      limpiarFormulario();
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
        setCategoria(egreso.categoria_nombre || "");
        setItem(egreso.item_nombre || "");
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

    const { error } = await supabase.from("egresos").delete().in("id", seleccionados);
    if (error) {
      console.error("Error Supabase:", error.message);
      setError("No se pudieron eliminar los egresos: " + error.message);
      return;
    }

    setEgresos(egresos.filter((e) => !seleccionados.includes(e.id)));
    setSeleccionados([]);
    setMensaje("🗑️ Egresos eliminados correctamente.");
  };

  const total = egresos.reduce((acc, egreso) => acc + egreso.monto, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <p>Registra y visualiza tus egresos.</p>

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
      />

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
