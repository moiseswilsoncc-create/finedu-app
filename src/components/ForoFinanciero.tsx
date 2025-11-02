import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

type Comentario = {
  id: string;
  autor: string;
  contenido: string;
  tema: string;
  fecha: string;
  expiracion: string;
};

type Encuesta = {
  id: string;
  pregunta: string;
  opciones: string[];
  votos: number[];
  fecha: string;
  activa: boolean;
};

const ForoFinanciero: React.FC<{ usuarioInstitucional?: boolean; usuarioId?: string }> = ({
  usuarioInstitucional = false,
  usuarioId = "",
}) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState({ autor: "", contenido: "", tema: "" });
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null);

  // Cargar comentarios y encuesta activa
  useEffect(() => {
    const cargarDatos = async () => {
      // Comentarios
      const { data: comentariosData } = await supabase
        .from("comentarios_foro")
        .select("*")
        .order("fecha", { ascending: false });

      const ahora = new Date();
      const vigentes = (comentariosData || []).filter(
        (c: Comentario) => new Date(c.expiracion) > ahora
      );
      setComentarios(vigentes);

      // Encuesta activa
      const { data: encuestaData } = await supabase
        .from("encuestas_foro")
        .select("*")
        .eq("activa", true)
        .single();

      if (encuestaData) {
        setEncuesta({
          id: encuestaData.id,
          pregunta: encuestaData.pregunta,
          opciones: encuestaData.opciones,
          votos: encuestaData.votos,
          fecha: encuestaData.fecha,
          activa: encuestaData.activa,
        });
      }
    };

    cargarDatos();
  }, []);

  // Manejo de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoComentario({ ...nuevoComentario, [name]: value });
  };

  // Publicar comentario
  const publicarComentario = async () => {
    const { autor, contenido, tema } = nuevoComentario;
    if (!autor.trim() || !contenido.trim() || !tema.trim()) return;

    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() + 15 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase.from("comentarios_foro").insert([
      {
        autor,
        contenido,
        tema,
        fecha: ahora.toISOString(),
        expiracion: expiracion.toISOString(),
      },
    ]);

    if (!error && data) {
      setComentarios([...(data || []), ...comentarios]);
      setNuevoComentario({ autor: "", contenido: "", tema: "" });
    }
  };

  // Crear encuesta (solo institucional)
  const crearEncuesta = async (pregunta: string, opciones: string[]) => {
    if (!usuarioInstitucional) return;

    const { data, error } = await supabase.from("encuestas_foro").insert([
      {
        pregunta,
        opciones,
        votos: opciones.map(() => 0),
        fecha: new Date().toISOString(),
        activa: true,
      },
    ]);

    if (!error && data) {
      setEncuesta(data[0]);
    }
  };

  // Votar en encuesta
  const votar = async () => {
    if (!encuesta || opcionSeleccionada === null) return;

    const nuevosVotos = [...encuesta.votos];
    nuevosVotos[opcionSeleccionada] += 1;

    const { error } = await supabase
      .from("encuestas_foro")
      .update({ votos: nuevosVotos })
      .eq("id", encuesta.id);

    if (!error) {
      setEncuesta({ ...encuesta, votos: nuevosVotos });
    }
  };

  // Desactivar encuesta (solo institucional)
  const desactivarEncuesta = async () => {
    if (!usuarioInstitucional || !encuesta) return;
    await supabase.from("encuestas_foro").update({ activa: false }).eq("id", encuesta.id);
    setEncuesta(null);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🗣️ Foro Financiero Comunitario</h2>
      <p>Comparte consejos, oportunidades y participa en encuestas institucionales.</p>

      {/* Encuesta */}
      {encuesta ? (
        <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>📝 Encuesta</h3>
          <p><strong>{encuesta.pregunta}</strong></p>
          {encuesta.opciones.map((op, idx) => (
            <div key={idx}>
              <label>
                <input
                  type="radio"
                  name="opcion"
                  value={idx}
                  checked={opcionSeleccionada === idx}
                  onChange={() => setOpcionSeleccionada(idx)}
                />
                {op} ({encuesta.votos[idx]} votos)
              </label>
            </div>
          ))}
          <button onClick={votar} style={{ marginTop: "0.5rem", padding: "0.4rem 1rem" }}>
            Votar
          </button>
          {usuarioInstitucional && (
            <button
              onClick={desactivarEncuesta}
              style={{ marginLeft: "1rem", padding: "0.4rem 1rem", background: "#e74c3c", color: "white" }}
            >
              Desactivar encuesta
            </button>
          )}
        </div>
      ) : usuarioInstitucional ? (
        <button
          onClick={() =>
            crearEncuesta("¿Cuál es el mes más pesado del año en gastos?", [
              "Marzo",
              "Septiembre",
              "Diciembre",
            ])
          }
        >
          ➕ Crear encuesta de ejemplo
        </button>
      ) : null}

      {/* Publicar comentario */}
      <div style={{ marginBottom: "2rem", background: "#f0f8ff", padding: "1rem", borderRadius: "8px" }}>
        <input
          type="text"
          name="autor"
          placeholder="Tu nombre"
          value={nuevoComentario.autor}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          name="tema"
          placeholder="Tema (ej. mejor banco, crédito en promoción)"
          value={nuevoComentario.tema}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          name="contenido"
          placeholder="Escribe tu comentario..."
          value={nuevoComentario.contenido}
          onChange={handleChange}
          rows={3}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <button onClick={publicarComentario} style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          Publicar
        </button>
      </div>

      {/* Lista de comentarios */}
      {comentarios.length === 0 ? (
        <p>No hay comentarios vigentes. Sé el primero en compartir.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comentarios.map((c) => (
            <li key={c.id} style={{
              marginBottom: "1.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#fafafa"
            }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>{c.autor}</strong>{" "}
                <span style={{ marginLeft: "0.5rem", background: "#dfe6e9", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                  {c.tema}
                </span>
              </div>
              <p style={{ margin: "0.5rem 0" }}>{c.contenido}</p>
              <small style={{ color: "#636e72" }}>
                Publicado {new Date(c.fecha).toLocaleString()}
              </small
