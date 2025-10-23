import React, { useState, useEffect } from "react";

type Comentario = {
  id: string;
  autor: string;
  contenido: string;
  tema: string;
  fecha: string;
  expiracion: string;
};

const ForoFinanciero: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState({
    autor: "",
    contenido: "",
    tema: "",
  });

  useEffect(() => {
    const ahora = new Date();
    const vigentes = comentarios.filter(
      (c) => new Date(c.expiracion) > ahora
    );
    setComentarios(vigentes);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNuevoComentario({ ...nuevoComentario, [name]: value });
  };

  const publicarComentario = () => {
    const { autor, contenido, tema } = nuevoComentario;
    if (!autor.trim() || !contenido.trim() || !tema.trim()) return;

    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 días

    const comentario: Comentario = {
      id: Date.now().toString(),
      autor,
      contenido,
      tema,
      fecha: ahora.toLocaleString(),
      expiracion: expiracion.toISOString(),
    };

    setComentarios([comentario, ...comentarios]);
    setNuevoComentario({ autor: "", contenido: "", tema: "" });
  };

  const comentariosVigentes = comentarios.filter(
    (c) => new Date(c.expiracion) > new Date()
  );

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🗣️ Foro Financiero Comunitario</h2>
      <p>Comparte oportunidades, consejos y experiencias que puedan ayudar a otros usuarios de Finedu.</p>

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

      {comentariosVigentes.length === 0 ? (
        <p>No hay comentarios vigentes. Sé el primero en compartir una oportunidad o consejo.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comentariosVigentes.map((c) => (
            <li key={c.id} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <p><strong>{c.autor}</strong> comentó sobre <em>{c.tema}</em> el {c.fecha}:</p>
              <p>{c.contenido}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ForoFinanciero;
