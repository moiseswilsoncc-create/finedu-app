import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import FormularioEgreso from "./FormularioEgreso";
import ListaEgresos from "./ListaEgresos";

interface Egreso {
  id: string;
  usuario_id: string;
  categoria: string;
  item: string;
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
      cargarEgresos(data.user.id);
      cargarCategorias(data.user.id);
    };
    getUser();
  }, []);

  const cargarCategorias = async (uid: string) => {
    const { data } = await supabase
      .from("categorias_egresos")
      .select("categoria")
      .eq("usuario_id", uid);
    setCategoriasDisponibles(data?.map((c: any) => c.categoria) || []);
  };

  const cargarItems = async (uid: string, cat: string) => {
    const { data } = await supabase
      .from("items_egresos")
      .select("item")
      .eq("usuario_id", uid)
      .eq("categoria", cat);
    setItemsDisponibles(data?.map((i: any) => i.item) || []);
  };

  const cargarEgresos = async (uid: string) => {
    const { data, error } = await supabase
      .from("egresos")
      .select("*")
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });
    if (error) {
      setError("No se pudieron cargar los egresos.");
    } else {
      setEgresos(data || []);
    }
  };

  const handleAgregarCategoria = async () => {
    if (nuevoCategoria && !categoriasDisponibles.includes(nuevoCategoria)) {
      await supabase.from("categorias_egresos").insert([{ usuario_id: usuarioId, categoria: nuevoCategoria }]);
      setCategoriasDisponibles([...categoriasDisponibles, nuevoCategoria]);
      setCategoria(nuevoCategoria);
      setNuevoCategoria("");
    }
  };

  const handleAgregarItem = async () => {
    if (nuevoItem && categoria && !itemsDisponibles.includes(nuevoItem)) {
      await supabase.from("items_egresos").insert([{ usuario_id: usuarioId, categoria, item: nuevoItem }]);
      setItemsDisponibles([...itemsDisponibles, nuevoItem]);
      setItem(nuevoItem);
      setNuevoItem("");
    }
  };

  const handleGuardarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!usuarioId) {
      setError("No hay usuario válido.");
      return;
    }

    if (editando) {
      const cambios: any = { categoria, item, monto: Number(monto), fecha, descripcion };
      const { error } = await supabase.from("egresos").update(cambios).eq("id", editando.id);
      if (error) {
        setError("No se pudo actualizar el egreso.");
      } else {
        setMensaje("✏️ Egreso actualizado correctamente.");
        setEgresos(egresos.map((e) => (e.id === editando.id ? { ...e, ...cambios } : e)));
        setEditando(null);
        limpiarFormulario();
      }
    } else {
      if (!categoria || !item || !monto || !fecha) {
        setError("Todos los campos son obligatorios.");
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
        limpiarFormulario();
      }
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

    const { error } = await supabase.from("egresos").delete().in("id", seleccionados);
    if (error) {
      setError("No se pudieron eliminar los egresos seleccionados.");
    } else {
      setEgresos(egresos.filter((e) => !seleccionados.includes(e.id)));
      setSeleccionados([]);
      setMensaje("🗑️ Egresos eliminados correctamente.");
    }
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

export default Egresos
