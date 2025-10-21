import React, { useState } from "react";
import VistaGrupal from "./components/VistaGrupal";
import VistaParticipante from "./components/VistaParticipante";

function App() {
  const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Meta familiar 2025");
  const [metaGrupal, setMetaGrupal] = useState(1000000);
  const [participantes, setParticipantes] = useState<
    { nombre: string; ingresos: number; egresos: number }[]
  >([]);

  const agregarParticipante = (nuevo: {
    nombre: string;
    ingresos: number;
    egresos: number;
  }) => {
    setParticipantes([...participantes, nuevo]);
  };

  return (
    <div>
      <VistaGrupal
        nombreGrupoMeta={nombreGrupoMeta}
        metaGrupal={metaGrupal}
        participantes={participantes}
      />
      <VistaParticipante onAgregar={agregarParticipante} />
    </div>
  );
}

export default App;
