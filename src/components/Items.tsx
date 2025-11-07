import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // ajusta la ruta según tu proyecto

function Items() {
  const [items, setItems] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
    cargarItems();
  }, []);

  const cargarItems = async () => {
    const { data, error } = await supabase
      .from("items_egresos")
      .select("*")
      .order("nombre", { ascending: true });

    if (!error) setItems(data || []);
  };

  const crearItem = async () => {
    const { error } = await supabase
      .from("items_egresos")
      .insert([{ nombre }]);

    if (error) {
      if (error.code === "23505") {
        alert("Este ítem ya existe");
      } else {
        alert("Error al crear ítem: " + error.message);
      }
    } else {
      setNombre("");
      cargarItems();
    }
  };

  const editarItem = async (id: string, nuevoNombre: string) => {
    const { error } = await supabase
      .from("items_egresos")
      .update({ nombre: nuevoNombre })
      .eq("id", id)
      .eq("usuario_id", user.id);

    if (error) {
      if (error.code === "23505") {
        alert("Este ítem ya existe");
      } else {
        alert("Error al editar ítem: " + error.message);
      }
    } else {
      cargarItems();
    }
  };

  const eliminarItem = async (id: string) => {
    const { error } = await supabase
      .from("items_egresos")
      .delete()
      .eq("id", id)
      .eq("usuario_id", user.id);

    if (error) {
      alert("Error al eliminar ítem: " + error.message);
    } else {
      cargarItems();
    }
  };

  return (
    <div>
      <h2>Ítems</h2>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nuevo ítem"
      />
      <button onClick={crearItem}>Agregar</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.nombre}
            {item.usuario_id === user?.id && (
              <>
                <button
                  onClick={() =>
                    editarItem(
                      item.id,
                      prompt("Nuevo nombre:", item.nombre) || item.nombre
                    )
                  }
                >
                  Editar
                </button>
                <button onClick={() => eliminarItem(item.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Items;
