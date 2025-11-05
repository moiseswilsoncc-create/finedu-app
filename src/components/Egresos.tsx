// src/components/Egresos.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Categoria {
  id: string;
  usuario_id: string;
  nombre: string;
  slug: string;
}

const Egresos: React.FC = () => {
  // Categorías fijas base
  const categoriasBase = [
    { slug: "hogar", label: "🏠 Gasto de Hogar" },
    { slug: "abarrotes", label: "🛒 Abarrotes" },
    { slug: "aseo", label: "🧼 Aseo" },
    { slug: "cuidado-personal", label: "🧴 Cuidado Personal" },
    { slug: "vestuario", label: "👕 Vestuario" },
    { slug: "frutas-verduras", label: "🍎 Frutas y Verduras" },
    { slug: "carnes", label: "🍖 Carnes" },
    { slug: "auto", label: "🚗 Auto" },
    { slug: "mascota", label: "🐶 Mascota" },
    { slug: "salud", label: "🏥 Salud" },
    { slug: "viajes", label: "✈️ Viajes" },
    { slug: "educacion", label: "🎓 Educación" },
    { slug: "entretenimiento", label: "🎉 Entretenimiento" },
    { slug: "seguros", label: "🛡️ Seguros" },
    { slug: "regalos", label: "🎁 Regalos y Donaciones" },
    { slug: "mantenimiento", label: "🛠️ Mantenimiento" },
    { slug: "tecnologia", label: "📡 Tecnología" },
    { slug: "creditos", label: "💳 Créditos y Deudas" },
  ];

  const [categoriasUsuario, setCategoriasUsuario] = useState<Categoria[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
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
      .from("categorias_egresos_usuario")
      .select("*")
      .eq("usuario_id", uid)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error cargando categorías:", error.message);
      setError("No se pudieron cargar tus categorías personalizadas.");
    } else {
      setCategoriasUsuario(data || []);
    }
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleAgregarCategoria = async () => {
    if (!usuarioId) {
      setError("⚠️ No hay sesión activa.");
      return;
    }

    const nombre = nuevoNombre.trim();
    if (!nombre) return;

    const slug = slugify(nombre);

    // Verificar duplicados
    const existeBase = categoriasBase.some((c) => c.slug === slug);
    const existeUsuario = categoriasUsuario.some((c) => c.slug === slug);

    if (existeBase || existeUsuario) {
      setError("⚠️ Esta categoría ya existe.");
      return;
    }

    const { data, error } = await supabase
      .from("categorias_egresos_usuario")
      .insert([{ usuario_id: usuarioId, nombre, slug }])
      .select();

    if (error) {
      console.error("Error insertando categoría:", error.message);
      setError("No se pudo guardar la categoría.");
    } else {
      setMensaje("✅ Categoría agregada correctamente.");
      setCategoriasUsuario([...(data || []), ...categoriasUsuario]);
      setNuevoNombre("");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <p>Selecciona una categoría para registrar tus egresos, o crea una nueva.</p>

      {/* Crear nueva categoría */}
      <div style={{ display: "flex", gap: "0.75rem", margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Nueva categoría (ej: Propina, Café)"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button
          type="button"
          onClick={handleAgregarCategoria}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#16a085",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Agregar
        </button>
      </div>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Categorías base */}
      <h3>Categorías principales</h3>
      <ul style={{ listStyle: "none", padding: 0, lineHeight: "2rem" }}>
        {categoriasBase.map((c) => (
          <li key={c.slug}>
            <Link to={`/egresos/${c.slug}`}>{c.label}</Link>
          </li>
        ))}
      </ul>

      {/* Categorías personalizadas */}
      {categoriasUsuario.length > 0 && (
        <>
          <h3 style={{ marginTop: "1.5rem" }}>Tus categorías</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2rem" }}>
            {categoriasUsuario.map((c) => (
              <li key={c.id}>
                <Link to={`/egresos/${c.slug}`}>➕ {c.nombre}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Egresos;
