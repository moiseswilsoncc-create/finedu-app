import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { OfertaColaborador } from "../types";

interface Props {
  usuario: {
    correo: string;
  };
}

const EditarOferta: React.FC<Props> = ({ usuario }) => {
  const [ofertas, setOfertas] = useState<OfertaColaborador[]>([]);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaColaborador | null>(null);
  const [mensaje, setMensaje] = useState("");

  const correo = usuario?.correo;

  useEffect(() => {
    const cargarOfertas = async () => {
      if (!correo) {
        setMensaje("⚠️ No se encontró el correo en la sesión.");
        return;
      }

      const { data, error } = await supabase
        .from("ofertas_colaborador")
        .select("*")
        .eq("colaborador", correo)
        .order("fecha_publicacion", { ascending: false });

      if (error) {
        setMensaje("❌ Error al cargar ofertas.");
        return;
      }

      if (data) {
        setOfertas(data as OfertaColaborador[]);
      }
    };

    cargarOfertas();
  }, [correo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOfertaSeleccionada((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "tasaInteres" ||
              name === "plazoMeses" ||
              name === "montoMinimo"
                ? Number(value)
                : value,
          }
        : null
    );
  };

  const handleUpdate = async () => {
    if (!ofertaSeleccionada) return;

    const { id, ...datosActualizados } = ofertaSeleccionada;

    const { error } = await supabase
      .from("ofertas_colaborador")
      .update(datosActualizados)
      .eq("id", id);

    if (error) {
      setMensaje("❌ Error al actualizar la oferta.");
    } else {
      setMensaje("✅ Oferta actualizada correctamente.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>✏️ Editar ofertas publicadas</h2>

      {ofertas.length === 0 ? (
        <p style={{ color: "#888" }}>
          No se encontraron ofertas publicadas por este colaborador.
        </p>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          <label htmlFor="selector" style={{ fontWeight: "bold" }}>
            Selecciona una oferta:
          </label>
          <select
            id="selector"
            onChange={(e) => {
              const oferta = ofertas.find((o) => o.id === Number(e.target.value));
              setOfertaSeleccionada(oferta || null);
              setMensaje("");
            }}
            style={{
              width: "100%",
              padding: "0.6rem",
              marginTop: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Selecciona --</option>
            {ofertas.map((oferta) => (
              <option key={oferta.id} value={oferta.id}>
                {oferta.titulo} ({oferta.tipo})
              </option>
            ))}
          </select>
        </div>
      )}

      {ofertaSeleccionada && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          style={{ display: "grid", gap: "1rem" }}
        >
          <input
            type="text"
            name="titulo"
            value={ofertaSeleccionada.titulo}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcion"
            value={ofertaSeleccionada.descripcion}
            onChange={handleChange}
            required
            style={{ height: "100px" }}
          />
          <select
            name="tipo"
            value={ofertaSeleccionada.tipo}
            onChange={handleChange}
            required
          >
            <option value="crédito">Crédito</option>
            <option value="inversión">Inversión</option>
            <option value="educación">Educación</option>
          </select>
          <input
            type="number"
            name="tasaInteres"
            value={ofertaSeleccionada.tasaInteres}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="plazoMeses"
            value={ofertaSeleccionada.plazoMeses}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="montoMinimo"
            value={ofertaSeleccionada.montoMinimo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pais"
            value={ofertaSeleccionada.pais}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="fecha_expiracion"
            value={ofertaSeleccionada.fecha_expiracion?.split("T")[0]}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            style={{
              padding: "0.8rem",
              backgroundColor: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            💾 Guardar cambios
          </button>
        </form>
      )}

      {mensaje && (
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: mensaje.includes("✅") ? "green" : "red",
          }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default EditarOferta;
