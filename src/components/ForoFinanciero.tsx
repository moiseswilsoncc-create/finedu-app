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

  // Cargar comentarios vigentes y encuesta activa
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);

      try {
        // Comentarios
        const { data: comentariosData, error: errComentarios } = await supabase
          .from("comentarios_foro")
          .select("*")
          .order("fecha", { ascending: false })
          .limit(50); // 🔒 límite para no saturar

        if (errComentarios) {
          setMsg("No se pudieron cargar los comentarios.");
        }

        const ahora = new Date();
        const vigentes = (comentariosData || []).filter(
          (c: Comentario) => new Date(c.expiracion) > ahora
        );
        setComentarios(vigentes);

        // Encuesta activa
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
      } catch (err: any) {
        console.error("Error inesperado:", err);
        setMsg("⚠️ Error inesperado al cargar datos.");
      } finally {
        setCargando(false);
      }
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
    if (!autor.trim() || !contenido.trim() || !tema.trim()) {
      setMsg("Todos los campos son obligatorios.");
      return;
    }
    if (contenido.length > 500) {
      setMsg("El comentario no puede superar 500 caracteres.");
      return;
    }

    setPublicando(true);
    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() + 15 * 24 * 60 * 60 * 1000);

    try {
      const { data, error } = await supabase.from("comentarios_foro").insert([
        {
          autor,
          contenido,
          tema,
          fecha: ahora.toISOString(),
          expiracion: expiracion.toISOString(),
        },
      ]);

      if (error) {
        setMsg("No se pudo publicar el comentario.");
        return;
      }

      setMsg("✅ Comentario publicado.");
      setNuevoComentario({ autor: "", contenido: "", tema: "" });
      setComentarios([...(data || []), ...comentarios]);
    } catch (err: any) {
      console.error("Error inesperado:", err);
      setMsg("⚠️ Error inesperado al publicar comentario.");
    } finally {
      setPublicando(false);
    }
  };

  // Votar en encuesta (blindaje real se hará en Supabase)
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
    setMsg("✅ Tu voto fue registrado.");
  };
          {/* Publicar comentario */}
          <div
            style={{
              marginBottom: "2rem",
              background: "#f0f8ff",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
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
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
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
