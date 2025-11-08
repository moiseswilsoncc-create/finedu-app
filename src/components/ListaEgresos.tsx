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

const ListaEgresos: React.FC<{
  usuarioId: string | null;
}> = ({ usuarioId }) => {
  const [egresos, setEgresos] = React.useState<Egreso[]>([]);
  const [seleccionados, setSeleccionados] = React.useState<string[]>([]);
  const [mesFiltro, setMesFiltro] = React.useState("");
  const [anioFiltro, setAnioFiltro] = React.useState("");
  const [categoriaFiltro, setCategoriaFiltro] = React.useState("");
  const [itemFiltro, setItemFiltro] = React.useState("");
  const [montoMin, setMontoMin] = React.useState<number | "">("");
  const [montoMax, setMontoMax] = React.useState<number | "">("");

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
    if (anioFiltro) query = query.eq("anio", anioFiltro);
    if (categoriaFiltro.trim() !== "")
      query = query.ilike("items_egresos.categorias_egresos.nombre", `%${categoriaFiltro.trim()}%`);
    if (itemFiltro.trim() !== "")
      query = query.ilike("items_egresos.nombre", `%${itemFiltro.trim()}%`);
    if (montoMin !== "") query = query.gte("monto", montoMin);
    if (montoMax !== "") query = query.lte("monto", montoMax);

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
          <input type="number" placeholder="2025" value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)} style={{ width: "6rem" }} />
        </div>

        <div>
          <label>Categoría</label>
          <input type="text" placeholder="Categoría" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} />
        </div>

        <div>
          <label>Ítem</label>
          <input type="text" placeholder="Ítem" value={itemFiltro} onChange={(e) => setItemFiltro(e.target.value)} />
        </div>

        <div>
          <label>Monto</label>
          <input type="number" placeholder="mín" value={montoMin} onChange={(e) => setMontoMin(e.target.value === "" ? "" : Number(e.target.value))} style={{ width: "6rem" }} />
          <input type="number" placeholder="máx" value={montoMax} onChange={(e) => setMontoMax(e.target.value === "" ? "" : Number(e.target.value))} style={{ width: "6rem", marginLeft: "0.5rem" }} />
        </div>

        <button type="button" onClick={() => usuarioId && cargarEgresos(usuarioId)}>
          🔄 Recargar
        </button>
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
