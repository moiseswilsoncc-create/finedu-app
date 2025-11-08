import React from "react";
import { supabase } from "../supabaseClient";

interface Egreso {
  id: string;
  usuario_id: string;
  monto: number;
  fecha: string;
  forma_pago?: string;
  item_nombre: string;
  categoria_nombre: string;
  mes?: string;
  anio?: number;
}

const ListaEgresos: React.FC<{ usuarioId: string | null }> = ({ usuarioId }) => {
  const [egresos, setEgresos] = React.useState<Egreso[]>([]);
  const [seleccionados, setSeleccionados] = React.useState<string[]>([]);
  const [mesFiltro, setMesFiltro] = React.useState("");
  const [anioFiltro, setAnioFiltro] = React.useState("");
  const [categoriaId, setCategoriaId] = React.useState<number | "">("");
  const [itemId, setItemId] = React.useState<number | "">("");
  const [montoMin, setMontoMin] = React.useState<string>("");
  const [montoMax, setMontoMax] = React.useState<string>("");
  const [categorias, setCategorias] = React.useState<{ id: number; nombre: string }[]>([]);
  const [items, setItems] = React.useState<{ id: number; nombre: string }[]>([]);

  const total = egresos.reduce((acc, e) => acc + e.monto, 0);

  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEditarSeleccionado = () => {
    // lógica de edición
  };

  const handleEliminarSeleccionados = () => {
    // lógica de eliminación
  };

  const cargarOpciones = async () => {
    const { data: cat } = await supabase.from("categorias_egresos").select("id, nombre");
    const { data: itm } = await supabase.from("items_egresos").select("id, nombre");
    if (cat) setCategorias(cat);
    if (itm) setItems(itm);
  };

  const cargarEgresos = async (uid: string) => {
    let query = supabase
      .from("egresos")
      .select(`
        id,
        usuario_id,
        monto,
        fecha,
        forma_pago,
        mes,
        anio,
        item_id,
        items_egresos (
          nombre,
          categoria_id,
          categorias_egresos (nombre)
        )
      `)
      .eq("usuario_id", uid)
      .order("fecha", { ascending: false });

    if (mesFiltro) query = query.eq("mes", mesFiltro);
    if (anioFiltro) query = query.eq("anio", Number(anioFiltro));
    if (categoriaId !== "") query = query.eq("items_egresos.categoria_id", categoriaId);
    if (itemId !== "") query = query.eq("item_id", itemId);
    if (montoMin !== "") query = query.gte("monto", Number(montoMin));
    if (montoMax !== "") query = query.lte("monto", Number(montoMax));

    const { data, error } = await query;

    if (error) {
      console.error("Error al cargar egresos:", error.message);
      return;
    }

    const egresosConNombres = (data || []).map((e: any) => ({
      id: e.id,
      usuario_id: e.usuario_id,
      monto: e.monto,
      fecha: e.fecha,
      forma_pago: e.forma_pago,
      mes: e.mes,
      anio: e.anio,
      item_nombre: e.items_egresos?.nombre || "",
      categoria_nombre: e.items_egresos?.categorias_egresos?.nombre || "",
    }));

    setEgresos(egresosConNombres);
  };

  React.useEffect(() => {
    cargarOpciones();
  }, []);

  React.useEffect(() => {
    if (usuarioId) {
      cargarEgresos(usuarioId);
    }
  }, [usuarioId, mesFiltro, anioFiltro, categoriaId, itemId, montoMin, montoMax]);

  return (
    <div>
      <h3>📋 Lista de Egresos</h3>

      {/* 🔹 Bloque de filtros */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label>Mes</label>
          <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
            <option value="">Todos</option>
            {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Año</label>
          <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}>
            <option value="">Todos</option>
            {["2023", "2024", "2025"].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Categoría</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Ítem</label>
          <select value={itemId} onChange={(e) => setItemId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Todos</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>{i.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Monto mínimo</label>
          <select value={montoMin} onChange={(e) => setMontoMin(e.target.value)}>
            <option value="">Sin mínimo</option>
            {["0", "10000", "50000", "100000"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Monto máximo</label>
          <select value={montoMax} onChange={(e) => setMontoMax(e.target.value)}>
            <option value="">Sin máximo</option>
            {["50000", "100000", "200000", "500000"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔹 Tabla de egresos */}
      <table border={1} cellPadding={5} style={{ width: "100%", marginBottom: "1rem" }}>
        <thead>
          <tr>
            <th>✔</th>
            <th>Categoría</th>
            <th>Ítem</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Forma de Pago</th>
          </tr>
        </thead>
        <tbody>
          {egresos.map((egreso) => (
            <tr key={egreso.id}>
              <td>
                <input type="checkbox" checked={seleccionados.includes(egreso.id)} onChange={() => toggleSeleccion(egreso.id)} />
              </td>
              <td>{egreso.categoria_nombre}</td>
              <td>{egreso.item_nombre}</td>
              <td>{egreso.monto}</td>
              <td>{egreso.fecha}</td>
              <td>{egreso.forma_pago}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Total:</strong> {total}</p>

      {/* 🔹 Botones de acción */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" onClick={handleEditarSeleccionado}>✏️ Editar</button>
        <button type="button" onClick={handleEliminarSeleccionados}>🗑️ Eliminar</button>
      </div>
    </div>
  );
};

export default ListaEgresos;
