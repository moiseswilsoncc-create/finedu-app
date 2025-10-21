import React, { useState } from "react";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
};

type Props = {
  onAgregar: (nuevo: Participante) => void;
};

function VistaParticipante({ onAgregar }: Props) {
  const [nombre, setNombre] = useState("");
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);

  const handleAgregar = () => {
    if (!nombre || ingresos < 0 || egresos < 0) return;
    onAgregar({ nombre, ingresos, egresos });
    setNombre("");
    setIngresos(0);
    setEgresos(0);
  };

  return (
    <div>
      <h3>Agregar participante</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ingresos"
        value={ingresos}
        onChange={(e) => setIngresos(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Egresos"
        value={egresos}
        onChange={(e) => setEgresos(Number(e.target.value))}
      />
      <button onClick={handleAgregar}>Agregar</button>
    </div>
  );
}

export default VistaParticipante;
