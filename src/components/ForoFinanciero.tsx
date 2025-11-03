import React, { useEffect, useState } from "react";
import axios from "axios";

interface Comentario {
  id: number;
  autor: string;
  tema: string;
  contenido: string;
  fecha: string;
}

interface Encuesta {
  id: number;
  pregunta: string;
  opciones: string[];
  votos: number[];
}

const ForoFinanciero: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState({
    autor: "",
    tema: "",
    contenido: "",
  });
  const [publicando, setPublicando] = useState(false);
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(true);
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resComentarios = await axios.get("/api/comentarios");
        setComentarios(resComentarios.data);

        const resEncuesta = await axios.get("/api/encuesta");
        setEncuesta(resEncuesta.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoComentario({
      ...nuevoComentario,
      [e.target.name]: e.target.value,
    });
  };

  const publicarComentario = async () => {
    if (!nuevoComentario.autor || !nuevoComentario.tema || !nuevoComentario.contenido) {
      setMsg("⚠️ Completa todos los campos antes de publicar.");
      return;
    }
    setPublicando(true);
    try {
      const res = await axios.post("/api/comentarios", {
        ...nuevoComentario,
        fecha: new Date().toISOString(),
      });
      setComentarios([res.data, ...comentarios]);
      setNuevoComentario({ autor: "", tema: "", contenido: "" });
      setMsg("✅ Comentario publicado con éxito.");
    } catch (error) {
      console.error("Error publicando comentario:", error);
      setMsg("❌ Error al publicar el comentario.");
    } finally {
      setPublicando(false);
    }
  };

  const votarEncuesta = (opcionIndex: number) => {
    if (!encuesta) return;
    const nuevosVotos = [...encuesta.votos];
    nuevosVotos[opcionIndex] += 1;
    setEncuesta({ ...encuesta, votos: nuevosVotos });
    setMsg("✅ Tu voto fue registrado.");
  };
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🗣️ Foro Financiero Comunitario</h2>
      <p>Comparte consejos, oportunidades y participa en encuestas institucionales.</p>

      {msg && <div style={{ marginBottom: "0.75rem", color: "#2c3e50" }}>{msg}</div>}

      {cargando ? (
        <p>Cargando datos…</p>
      ) : (
        <div>
          {/* Encuesta activa */}
          {encuesta && (
            <div
              style={{
                marginBottom: "2rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <h3>{encuesta.pregunta}</h3>
              {encuesta.opciones.map((opcion, index) => (
                <button
                  key={index}
                  onClick={() => votarEncuesta(index)}
                  style={{
                    display: "block",
                    margin: "0.5rem 0",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {opcion} ({encuesta.votos[index]})
                </button>
              ))}
            </div>
          )}

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
        </div>
      )}
    </div>
  );
};

export default ForoFinanciero;
