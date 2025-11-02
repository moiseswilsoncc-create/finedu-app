import React, { useState } from "react";
import { formatearMoneda } from "../utils/formatearMoneda";

interface Participante {
  correo: string;
  nombre?: string;
}

interface Grupo {
  nombre: string;
  tipoAhorro: string;
  metaTotal: number;
  aporteMensual: number;
  participantes: Participante[];
  tasa?: number;
  plazoMeses?: number;
  montoFinal?: number;
  fechaFin?: string;
}

type Props = {
  pais: string;
  usuarioActual: string; // correo del usuario logueado
};

const AhorroGrupal: React.FC<Props> = ({ pais, usuarioActual }) => {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [tipoAhorro, setTipoAhorro] = useState("");
  const [metaTotal, setMetaTotal] = useState(100000);
  const [aporteMensual, setAporteMensual] = useState(1000);
  const [tasa, setTasa] = useState<number | "">("");
  const [plazoMeses, setPlazoMeses] = useState<number | "">("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [correoNuevo, setCorreoNuevo] = useState("");

  // Cálculo de proyección grupal
  const calcularMontoFinal = (
    tipo: string,
    aporteGrupalMensual: number,
    tasa?: number,
    plazoMeses?: number
  ): { montoFinal: number; fechaFin?: string } => {
    let montoFinal = aporteGrupalMensual * (plazoMeses ?? 0);
    let fechaFin: string | undefined = undefined;

    if ((tipo === "Ahorro con interés" || tipo === "APV") && tasa && plazoMeses) {
      const tasaMensual = tasa / 100 / 12;
      montoFinal = aporteGrupalMensual * ((Math.pow(1 + tasaMensual, plazoMeses) - 1) / tasaMensual);
      const inicio = new Date();
      const fin = new Date(inicio);
      fin.setMonth(inicio.getMonth() + plazoMeses);
      fechaFin = fin.toISOString().split("T")[0];
    }

    if (tipo === "Ahorro en UF" && plazoMeses) {
      const tasaMensual = 0.03 / 12; // asumimos 3% anual de reajuste
      montoFinal = aporteGrupalMensual * ((Math.pow(1 + tasaMensual, plazoMeses) - 1) / tasaMensual);
      const inicio = new Date();
      const fin = new Date(inicio);
      fin.setMonth(inicio.getMonth() + plazoMeses);
      fechaFin = fin.toISOString().split("T")[0];
    }

    return { montoFinal, fechaFin };
  };

  const aporteGrupalMensual = participantes.length * aporteMensual;
  const mesesEstimados =
    aporteGrupalMensual > 0 ? Math.ceil(metaTotal / aporteGrupalMensual) : 0;

  const { montoFinal, fechaFin } = calcularMontoFinal(
    tipoAhorro,
    aporteGrupalMensual,
    tasa ? Number(tasa) : undefined,
    plazoMeses ? Number(plazoMeses) : mesesEstimados
  );

  const handleAgregarParticipante = () => {
    if (!correoNuevo) return;
    setParticipantes([...participantes, { correo: correoNuevo }]);
    setCorreoNuevo("");
  };

  const handleCrearGrupo = () => {
    const nuevoGrupo: Grupo = {
      nombre: nombreGrupo,
      tipoAhorro,
      metaTotal,
      aporteMensual,
      participantes,
      tasa: tasa ? Number(tasa) : undefined,
      plazoMeses: plazoMeses ? Number(plazoMeses) : undefined,
      montoFinal,
      fechaFin,
    };
    console.log("Grupo creado:", nuevoGrupo);
    // 🔄 En fase 2: guardar en Supabase (grupos_ahorro + ahorro_grupal)
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "800px",
      margin: "2rem auto",
      backgroundColor: "#fefefe",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h2>👥 Ahorro Grupal</h2>
      <p>
        Como administrador puedes crear un grupo, definir el tipo de ahorro,
        la meta y los participantes. Todos los miembros verán el mismo progreso,
        pero solo tú podrás editar.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label>Nombre del grupo: </label>
        <input type="text" value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Tipo de ahorro grupal: </label>
        <select value={tipoAhorro} onChange={(e) => setTipoAhorro(e.target.value)} required>
          <option value="">-- Selecciona --</option>
          <option value="Ahorro normal">Ahorro normal</option>
          <option value="Ahorro con interés">Ahorro con interés</option>
          <option value="Ahorro en UF">Ahorro en UF</option>
          <option value="APV">APV</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Meta total: </label>
        <input type="number" value={metaTotal} onChange={(e) => setMetaTotal(Number(e.target.value))} />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Aporte mensual por persona: </label>
        <input type="number" value={aporteMensual} onChange={(e) => setAporteMensual(Number(e.target.value))} />
      </div>

      {(tipoAhorro === "Ahorro con interés" || tipoAhorro === "APV" || tipoAhorro === "Ahorro en UF") && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label>Tasa de interés (% anual): </label>
            <input type="number" value={tasa} onChange={(e) => setTasa(Number(e.target.value))} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Plazo (meses): </label>
            <input type="number" value={plazoMeses} onChange={(e) => setPlazoMeses(Number(e.target.value))} />
          </div>
        </>
      )}

      <h3>👤 Participantes</h3>
      <ul>
        {participantes.map((p, i) => (
          <li key={i}>{p.correo}</li>
        ))}
      </ul>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Correo del participante"
          value={correoNuevo}
          onChange={(e) => setCorreoNuevo(e.target.value)}
        />
        <button onClick={handleAgregarParticipante}>➕ Agregar</button>
      </div>

      <button onClick={handleCrearGrupo}>✅ Crear Grupo</button>

      <hr style={{ margin: "2rem 0" }} />

      <h3>📊 Proyección del grupo</h3>
      <ul style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
        <li><strong>🧮 Aporte grupal mensual:</strong> {formatearMoneda(aporteGrupalMensual, pais)}</li>
        <li><strong>📅 Meses estimados para alcanzar la meta:</strong> {mesesEstimados}</li>
        <li><strong>📦 Total aportado al final:</strong> {formatearMoneda(montoFinal, pais)}</li>
        <li><strong>📆 Fecha estimada de término:</strong> {fechaFin ?? "-"}</li>
      </ul>
    </div>
  );
};

export default AhorroGrupal;
