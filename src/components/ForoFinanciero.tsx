// src/components/ForoFinanciero.tsx
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
  const [cargando, setCargando] = useState<boolean>(true);
  const [publicando, setPublicando] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  // Cargar comentarios vigentes y encuesta activa (fija mientras activa = true)
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      // Comentarios
      const { data: comentariosData, error: errComentarios } = await supabase
        .from("comentarios_foro")
        .select("*")
        .order("fecha", { ascending: false });

      if (errComentarios) {
        setMsg("No se pudieron cargar los comentarios.");
      }

      const ahora = new Date();
      const vigentes = (comentariosData || []).filter(
        (c: Comentario) => new Date(c.expiracion) > ahora
      );
      setComentarios(vigentes);

      // Encuesta activa (fija)
      const { data: encuestaData, error: errEncuesta } = await supabase
        .from("encuestas_foro")
        .select("*")
        .eq("activa", true)
        .order("fecha", { ascending: false })
        .limit(1);

      if (!errEncuesta && encuestaData && encuestaData.length > 0) {
        const e = encuestaData[0];
        setEncuesta({
          id: e.id,
          pregunta: e.pregunta,
          opciones: e.opciones,
          votos: e.votos,
          fecha: e.fecha,
          activa: e.activa,
        });
      } else {
        setEncuesta(null);
      }

      setCargando(false);
    };

    cargarDatos();
  }, []);

  // Manejo de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoComentario({ ...nuevoComentario, [name]: value });
  };

  // Publicar comentario (vigencia 15 días)
  const publicarComentario = async () => {
    const { autor, contenido, tema } = nuevoComentario;
    if (!autor.trim() || !contenido.trim() || !tema.trim()) return;

    setPublicando(true);
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

    setPublicando(false);

    if (error) {
      setMsg("No se pudo publicar el comentario.");
      return;
    }

    setMsg("Comentario publicado.");
    setNuevoComentario({ autor: "", contenido: "", tema: "" });
    setComentarios([...(data || []), ...comentarios]);
  };

  // Crear encuesta (solo institucional, queda fija mientras activa = true)
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

    if (error) {
      setMsg("No se pudo crear la encuesta.");
      return;
    }

    if (data && data.length > 0) {
      const e = data[0];
      setEncuesta({
        id: e.id,
        pregunta: e.pregunta,
        opciones: e.opciones,
        votos: e.votos,
        fecha: e.fecha,
        activa: e.activa,
      });
      setMsg("Encuesta creada y fijada en el foro.");
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

    if (error) {
      setMsg("No se pudo registrar el voto.");
      return;
    }

    setEncuesta({ ...encuesta, votos: nuevosVotos });
    setMsg("Tu voto fue registrado.");
  };

  // Desactivar encuesta (oculta, pero no se elimina; se puede reactivar luego)
  const desactivarEncuesta = async () => {
    if (!usuarioInstitucional || !encuesta) return;
    const { error } = await supabase
      .from("encuestas_foro")
      .update({ activa: false })
      .eq("id", encuesta.id);

    if (error) {
      setMsg("No se pudo desactivar la encuesta.");
      return;
    }

    setEncuesta(null);
    setMsg("Encuesta desactivada (puede reactivarse más adelante).");
  };

  // Reactivar una encuesta por id (ejemplo simple)
  const reactivarEncuesta = async (id: string) => {
    if (!usuarioInstitucional) return;
    const { error } = await supabase
      .from("encuestas_foro")
      .update({ activa: true })
      .eq("id", id);

    if (error) {
      setMsg("No se pudo reactivar la encuesta.");
      return;
    }

    // Re-cargar encuesta activa
    const { data: encuestaData } = await supabase
      .from("encuestas_foro")
      .select("*")
      .eq("activa", true)
      .order("fecha", { ascending: false })
      .limit(1);

    if (encuestaData && encuestaData.length > 0) {
      const e = encuestaData[0];
      setEncuesta({
        id: e.id,
        pregunta: e.pregunta,
        opciones: e.opciones,
        votos: e.votos,
        fecha: e.fecha,
        activa: e.activa,
      });
      setMsg("Encuesta reactivada y fijada en el foro.");
    }
  };
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🗣️ Foro Financiero Comunitario</h2>
      <p>Comparte consejos, oportunidades y participa en encuestas institucionales.</p>

      {msg && (
        <div style={{ marginBottom: "0.75rem", color: "#2c3e50" }}>
          {msg}
        </div>
      )}

      {cargando ? (
        <p>Cargando datos…</p>
      ) : (
        <>
          {/* Encuesta fija mientras activa = true */}
          {encuesta ? (
            <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
              <h3>📝 Encuesta</h3>
              <p><strong>{encuesta.pregunta}</strong></p>

              {encuesta.opciones.map((op, idx) => (
                <div key={idx} style={{ margin: "0.25rem 0" }}>
                  <label>
                    <input
                      type="radio"
                      name="opcion"
                      value={idx}
                      checked={opcionSeleccionada === idx}
                      onChange={() => setOpcionSeleccionada(idx)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    {op} <span style={{ color: "#7f8c8d" }}>({encuesta.votos[idx]} votos)</span>
                  </label>
                </div>
              ))}

              <div style={{ marginTop: "0.75rem" }}>
                <button
                  onClick={votar}
                  style={{ padding: "0.4rem 1rem", background: "#2980b9", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Votar
                </button>

                {usuarioInstitucional && (
                  <>
                    <button
                      onClick={desactivarEncuesta}
                      style={{ marginLeft: "0.5rem", padding: "0.4rem 1rem", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Desactivar encuesta
                    </button>

                    {/* Ejemplo: reactivar por id manual (puedes reemplazar por selector) */}
                    <button
                      onClick={() => reactivarEncuesta(encuesta.id)}
                      style={{ marginLeft: "0.5rem", padding: "0.4rem 1rem", background: "#27ae60", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Reactivar encuesta
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            usuarioInstitucional && (
              <button
                onClick={() =>
                  crearEncuesta("¿Cuál es el mes más pesado del año en gastos?", [
                    "Marzo",
                    "Septiembre",
                    "Diciembre",
                  ])
                }
                style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "#8e44ad", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                ➕ Crear encuesta de ejemplo
              </button>
            )
          )}

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
            <button
              onClick={publicarComentario}
              disabled={publicando}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              {publicando ? "Publicando…" : "Publicar"}
            </button>
          </div>

          {/* Lista de comentarios */}
          {comentarios.length === 0 ? (
            <p>No hay comentarios vigentes. Sé el primero en compartir.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {comentarios.map((c) => (
                <li
                  key={c.id}
                  style={{
                    marginBottom: "1.5rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>{c.autor}</strong>{" "}
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        background: "#dfe6e9",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {c.tema}
                    </span>
                  </div>
                  <p style={{ margin: "0.5rem 0" }}>{c.contenido}</p>
                  <small style={{ color: "#636e72" }}>
                    Publicado {new Date(c.fecha).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ForoFinanciero;
