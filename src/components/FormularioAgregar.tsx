import React, { useState, useContext, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { GrupoContext } from "../context/GrupoContext";
import { agregarParticipanteNuevo } from "../utils/agregarParticipanteNuevo";

type Props = { grupoId: string };

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function normalizarCorreo(c: string) {
  return c.trim().toLowerCase();
}

export default function FormularioAgregar({ grupoId }: Props) {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // ✅ Consumimos contexto institucional
  const { participantes, actualizarParticipante } = useContext(GrupoContext);

  // ✅ Derivados
  const correoNorm = useMemo(() => normalizarCorreo(correo), [correo]);
  const correoValido = useMemo(() => EMAIL_REGEX.test(correoNorm), [correoNorm]);
  const yaExiste = useMemo(
    () => participantes.some((p) => normalizarCorreo(p.correo) === correoNorm),
    [participantes, correoNorm]
  );

  async function handleAgregar(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setMensaje("");
    setError("");

    // Guardas de UI
    if (!correoValido) {
      setError("⚠️ Ingresa un correo válido.");
      return;
    }
    if (yaExiste) {
      setError("⚠️ Este correo ya está en la lista de participantes.");
      return;
    }

    setCargando(true);
    try {
      // 0️⃣ Verificar sesión activa
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Debes iniciar sesión para agregar participantes.");

      // 1️⃣ Insertar en BD
      const res = await agregarParticipanteNuevo(grupoId, correoNorm);
      if (res.error) throw new Error(res.mensaje || "Error al agregar participante en BD.");

      // 2️⃣ Sincronizar contexto con identidad completa
      await actualizarParticipante(correoNorm, grupoId, 0);

      // 3️⃣ Feedback y reset
      setMensaje("✅ Participante agregado correctamente.");
      setCorreo("");
    } catch (err: any) {
      setError(err.message || "❌ Error al agregar participante.");
    } finally {
      setCargando(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleAgregar();
    }
  }

  const botonDeshabilitado = cargando || !correoValido || yaExiste;

  return (
    <form onSubmit={handleAgregar} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
      <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Correo del participante"
          aria-invalid={!correoValido}
          aria-describedby="ayuda-correo"
          required
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={botonDeshabilitado}>
          {cargando ? "Agregando..." : "Agregar"}
        </button>
      </div>

      <div style={{ minHeight: 24, flexBasis: "100%" }} aria-live="polite">
        {mensaje && <span style={{ color: "green" }}>{mensaje}</span>}
        {error && <span style={{ color: "red" }}>{error}</span>}
        {!correoValido && correo.length > 0 && !error && (
          <small id="ayuda-correo" style={{ color: "#8a6d3b" }}>
            Ingresa un correo válido con formato usuario@dominio.tld
          </small>
        )}
        {yaExiste && !error && (
          <small style={{ color: "#8a6d3b" }}>
            Este correo ya está en la lista. Edita la cuota si lo necesitas.
          </small>
        )}
      </div>
    </form>
  );
}
