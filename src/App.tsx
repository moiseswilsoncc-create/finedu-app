import React, { useState } from "react";
import VistaGrupal from "./components/VistaGrupal";
import VistaParticipante from "./components/VistaParticipante";
import VistaMetaIndividual from "./components/VistaMetaIndividual";
import VistaEtapa from "./components/VistaEtapa";
import Resumen from "./components/Resumen";
import SimuladorCredito from "./components/SimuladorCredito";
import SimuladorCreditoAuto from "./components/SimuladorCreditoAuto";
import SimuladorCreditoVivienda from "./components/SimuladorCreditoVivienda";
import GraficoAhorro from "./components/GraficoAhorro";
import SimuladorInversion from "./components/SimuladorInversion";
import PanelColaboradores from "./components/PanelColaboradores";
import IngresoUsuario from "./components/IngresoUsuario";
import IngresoColaborador from "./components/IngresoColaborador";

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
  const [tipoUsuario, setTipoUsuario] = useState<"usuario" | "colaborador" | null>(null);
  const [pais, setPais] = useState<string>("Chile"); // país por defecto

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
      <h1>Bienvenido a Finedu</h1>

      {!tipoUsuario && (
        <div>
          <button onClick={() => setTipoUsuario("usuario")}>Ingresar como usuario</button>
          <button onClick={() => setTipoUsuario("colaborador")}>Ingresar como colaborador</button>
        </div>
      )}

      {tipoUsuario === "usuario" && (
        <>
          <IngresoUsuario setPais={setPais} />

          <Resumen metaGrupal={metaGrupal} participantes={participantes} />
          <VistaEtapa participantes={participantes} />
          <VistaGrupal
            nombreGrupoMeta={nombreGrupoMeta}
            metaGrupal={metaGrupal}
            participantes={participantes}
          />
          <VistaMetaIndividual participantes={participantes} />
          <VistaParticipante onAgregar={agregarParticipante} />
          <SimuladorCredito pais={pais} />
          <SimuladorCreditoAuto pais={pais} />
          <SimuladorCreditoVivienda pais={pais} />
          <GraficoAhorro participantes={participantes} metaGrupal={metaGrupal} />
          <SimuladorInversion pais={pais} />
        </>
      )}

      {tipoUsuario === "colaborador" && (
        <>
          <IngresoColaborador setPais={setPais} />
          <PanelColaboradores pais={pais} />
        </>
      )}
    </div>
  );
}

export default App;
