import React, { useState } from "react";
import VistaGrupal from "./components/VistaGrupal";
import VistaParticipante from "./components/VistaParticipante";
import VistaMetaIndividual from "./components/VistaMetaIndividual";
import VistaEtapa from "./components/VistaEtapa";
import Resumen from "./components/Resumen";
import SimuladorCredito from "./components/SimuladorCredito";
import SimuladorCreditoAuto from "./components/SimuladorCreditoAuto";

type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
  metaIndividual: number;
};

function App() {
  const [nombreGrupoMeta, setNombreGrupoMeta] = useState("Meta familiar 2025");
  const [metaGrupal, setMetaGrupal] = useState(1000000);
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  const agregarParticipante = (nuevo: {
    nombre: string;
    ingresos: number;
    egresos: number;
  }) => {
    const metaIndividual = 200000;
    const participanteConMeta: Participante = {
      ...nuevo,
      metaIndividual,
    };
    setParticipantes([...participantes, participanteConMeta]);
  };

  return (
    <div>
      <h1>{nombreGrupoMeta}</h1>

      <Resumen metaGrupal={metaGrupal} participantes={participantes} />

      <VistaEtapa participantes={participantes} />

      <VistaGrupal
        nombreGrupoMeta={nombreGrupoMeta}
        metaGrupal={metaGrupal}
        participantes={participantes}
      />

      <VistaMetaIndividual participantes={participantes} />

      <VistaParticipante onAgregar={agregarParticipante} />

      <SimuladorCredito />

      <SimuladorCreditoAuto />
    </div>
  );
}

export default App;
