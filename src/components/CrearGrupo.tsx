import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CrearGrupo() {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [metaTotal, setMetaTotal] = useState(0);
  const [aporteMensual, setAporteMensual] = useState(0);
  const [plazoMeses, setPlazoMeses] = useState(0);
  const [fechaTermino, setFechaTermino] = useState("");
  const [correos, setCorreos] = useState<string[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<string, string>>({});

  const handleCrearGrupo = async () => {
    try {
      // 1. Validar sesión
      const { data: { user }, error: errorUsuario } = await supabase.auth.getUser();
      if (errorUsuario || !user) {
        console.error("❌ No hay sesión activa. Error:", errorUsuario);
        alert("Debes iniciar sesión para crear un grupo.");
        return;
      }
      console.log("🧠 Usuario autenticado:", user.id, "Correo:", user.email);

      // 2. Insertar grupo
      const { data: grupoData, error: grupoError } = await supabase
        .from("grupos_ahorro")
        .insert({
          nombre: nombreGrupo,
          meta_total: metaTotal,
          aporte_mensual: aporteMensual,
          plazo_meses: plazoMeses,
          fecha_inicio: new Date().toISOString(),
          fecha_fin: fechaTermino,
          administrador_id: user.id,
          created_at: new Date().toISOString(),
          estado: "activo",
        })
        .select()
        .single();

      if (grupoError) {
        console.error("❌ Error insertando grupo:", grupoError);
        return;
      }
      console.log("✅ Grupo creado:", grupoData);

      const grupoId = grupoData.id_uuid;

      // 3. Validar usuarios antes de insertarlos
      for (const correo of correos) {
        if (!usuariosMap[correo]) {
          console.error("⚠️ Usuario no encontrado en tabla usuarios:", correo);
          continue; // evita romper el flujo
        }

        const { error: participanteError } = await supabase
          .from("participantes_grupo")
          .insert({
            grupo_id: grupoId,
            usuario_id: usuariosMap[correo],
            correo,
            rol: correo === user.email ? "admin" : "participante",
            fecha_ingreso: new Date().toISOString(),
            estado: "activo",
            invitado_por: user.id,
          });

        if (participanteError) {
          console.error("❌ Error insertando participante:", correo, participanteError);
        } else {
          console.log("✅ Participante insertado:", correo);
        }
      }
    } catch (err) {
      console.error("❌ Error general en crearGrupo:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3>🆕 Crear grupo</h3>

      <input
        type="text"
        value={nombreGrupo}
        onChange={(e) => setNombreGrupo(e.target.value)}
        placeholder="Nombre del grupo"
        required
      />
      <input
        type="number"
        value={metaTotal}
        onChange={(e) => setMetaTotal(Number(e.target.value))}
        placeholder="Meta total en CLP"
        required
        min={1}
      />
      <input
        type="number"
        value={aporteMensual}
        onChange={(e) => setAporteMensual(Number(e.target.value))}
        placeholder="Aporte mensual en CLP"
        required
        min={1}
      />
      <input
        type="number"
        value={plazoMeses}
        onChange={(e) => setPlazoMeses(Number(e.target.value))}
        placeholder="Plazo en meses"
        required
        min={1}
      />
      <input
        type="date"
        value={fechaTermino}
        onChange={(e) => setFechaTermino(e.target.value)}
        placeholder="Fecha de término"
        required
      />

      <button onClick={handleCrearGrupo}>Crear grupo</button>
    </div>
  );
}
