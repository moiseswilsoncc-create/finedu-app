import React, { useState } from "react";

type Comentario = {
  autor: string;
  contenido: string;
  tema: string;
  fecha: string;
};

function ForoFinanciero() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState({
    autor: "",
    contenido: "",
    tema: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoComentario({ ...nuevoComentario, [name]: value });
  };

  const publicarComentario = () => {
    const comentario: Comentario = {
      ...nuevoComentario,
      fecha: new Date().toLocaleString(),
    };
    setComentarios([comentario, ...comentarios]);
    setNuevoComentario({ autor: "", contenido: "", tema: "" });
  };

  return (
    <div>
      <h3>Foro Financiero Comunitario</h3>

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

      <ul>
        {comentarios.map((c, index) => (
          <li key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
            <strong>{c.autor}</strong> comentó sobre <em>{c.tema}</em> el {c.fecha}:
            <p>{c.contenido}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForoFinanciero;
