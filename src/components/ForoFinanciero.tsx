import React, { useState, useEffect } from "react";

type Comentario = {
  autor: string;
  contenido: string;
  tema: string;
  fecha: string;
  expiracion: string;
};

function ForoFinanciero() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState({
    autor: "",
    contenido: "",
    tema: "",
  });

  // Filtrar automáticamente los comentarios vigentes
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
    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 días

    const comentario: Comentario = {
      autor: nuevoComentario.autor,
      contenido: nuevoComentario.contenido,
      tema: nuevoComentario.tema,
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
    <div>
      <h3>🗣️ Foro Financiero Comunitario</h3>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="autor"
          placeholder="Tu nombre"
          value={nuevoComentario.autor}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tema"
          placeholder="Tema (ej. mejor banco, crédito en promoción)"
          value={nuevoComentario.tema}
          onChange={handleChange}
        />
        <textarea
          name="contenido"
          placeholder="Escribe tu comentario..."
          value={nuevoComentario.contenido}
          onChange={handleChange}
        />
        <button onClick={publicarComentario}>Publicar</button>
      </div>

      {comentariosVigentes.length === 0 ? (
        <p>No hay comentarios vigentes. Sé el primero en compartir una oportunidad.</p>
      ) : (
        <ul>
          {comentariosVigentes.map((c, index) => (
            <li key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
              <strong>{c.autor}</strong> comentó sobre <em>{c.tema}</em> el {c.fecha}:
              <p>{c.contenido}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ForoFinanciero;
