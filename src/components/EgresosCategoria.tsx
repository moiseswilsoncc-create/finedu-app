// src/components/EgresosCategoria.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

interface Item {
  id: number;
  categoria_id: number;
  nombre: string;
}

const EgresosCategoria: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [itemId, setItemId] = useState("");
  const [nuevoItem, setNuevoItem] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar categoría principal
  useEffect(() => {
    const cargarCategoria = async () => {
      const { data, error } = await supabase
        .from("categorias_egresos")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error.message);
        setError("No se pudo cargar la categoría.");
      } else {
        setCategoria(data);
        cargarItems(data.id);
      }
    };
    cargarCategoria();
  }, [slug]);

  // Cargar ítems (subcategorías)
  const cargarItems = async (categoriaId: number) => {
    const { data, error } = await supabase
      .from("items_egresos")
      .select("*")
      .eq("categoria_id", categoriaId)
      .order("nombre", { ascending: true });

    if (error) {
      console.error(error.message);
      setError("No se pudieron cargar los ítems.");
    } else {
      setItems(data || []);
    }
  };

  // Agregar nuevo ítem personalizado
  const handleAgregarItem = async () => {
    if (!categoria || !nuevoItem.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setError("⚠️ No hay sesión activa.");
      return;
    }

    const { data, error } = await supabase
      .from("items_egresos")
      .insert([
        {
          categoria_id: categoria.id,
          nombre: nuevoItem.trim(),
          usuario_id: userData.user.id,
        },
      ])
      .select();

    if (error) {
      console.error(error.message);
      setError("No se pudo crear el ítem.");
    } else {
      setItems([...(data || []), ...items]);
      setNuevoItem("");
      setMensaje("✅ Ítem agregado correctamente.");
    }
  };

  // Registrar egreso
  const handleRegistrarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setError("⚠️ No hay sesión activa.");
      return;
    }

    if (!itemId || !monto || !fecha) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const itemSeleccionado = items.find((i) => i.id === Number(itemId));

    const { error: insertError } = await supabase.from("egresos").insert([
      {
        usuario_id: userData.user.id,
        categoria: categoria?.nombre,
        item: itemSeleccionado?.nombre,
        monto: Number(monto),
        fecha,
      },
    ]);

    if (insertError) {
      console.error(insertError.message);
      setError("No se pudo registrar el egreso.");
    } else {
      setMensaje("✅ Egreso registrado correctamente.");
      setMonto("");
      setFecha("");
      setItemId("");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos - {categoria?.nombre}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      {/* Formulario de registro */}
      <form onSubmit={handleRegistrarEgreso} style={{ marginBottom: "1.5rem" }}>
        <div>
          <label>Ítem (subcategoría): </label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          >
            <option value="">-- Selecciona --</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Monto: </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
            min={0}
          />
        </div>

        <div>
          <label>Fecha: </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <button type="submit">➕ Registrar Egreso</button>
      </form>

      {/* Crear nuevo ítem */}
      <h3>➕ Agregar nuevo ítem</h3>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <input
          type="text"
          placeholder="Ej: Propina, Café, Netflix"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button
          type="button"
          onClick={handleAgregarItem}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#16a085",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EgresosCategoria;
