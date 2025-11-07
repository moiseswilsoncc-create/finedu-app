import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // ajusta la ruta según tu proyecto

function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      cargarCategorias();
    }
  }, [user]);

  const cargarCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias_egresos")
      .select("*")
      .or(`usuario_id.eq.${user.id},usuario_id.is.null`)
      .order("nombre", { ascending: true });

    if (!error) setCategorias(data || []);
  };

  const crearCategoria = async () => {
    if (!user) {
      alert("Usuario no autenticado");
      return;
    }

    const { error } = await supabase
      .from("categorias_egresos")
      .insert([{ nombre, usuario_id: user.id }]);

    if (error) {
      if (error.code === "23505") {
        alert("⚠️ Esta categoría ya existe para tu usuario. Intenta con otro nombre.");
      } else {
        alert("Error al crear categoría: " + error.message);
      }
    } else {
      setNombre("");
      cargarCategorias();
    }
  };

  const editarCategoria = async (id: string, nuevoNombre: string) => {
    const { error } = await supabase
      .from("categorias_egresos")
      .update({ nombre: nuevoNombre })
      .eq("id", id)
      .eq("usuario_id", user.id);

    if (error) {
      if (error.code === "23505") {
        alert("⚠️ Esta categoría ya existe para tu usuario. Intenta con otro nombre.");
      } else {
        alert("Error al editar categoría: " + error.message);
      }
    } else {
      cargarCategorias();
    }
  };

  const eliminarCategoria = async (id: string) => {
    const { error } = await supabase
      .from("categorias_egresos")
      .delete()
      .eq("id", id)
      .eq("usuario_id", user.id);

    if (error) {
      alert("Error al eliminar categoría: " + error.message);
    } else {
      cargarCategorias();
    }
  };

  return (
    <div>
      <h2>Categorías</h2>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nueva categoría"
      />
      <button onClick={crearCategoria}>Agregar</button>

      <ul>
        {categorias.map((cat) => (
          <li key={cat.id}>
            {cat.nombre}
            {cat.usuario_id === user?.id && (
              <>
                <button
                  onClick={() =>
                    editarCategoria(
                      cat.id,
                      prompt("Nuevo nombre:", cat.nombre) || cat.nombre
                    )
                  }
                >
                  Editar
                </button>
                <button onClick={() => eliminarCategoria(cat.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categorias;
