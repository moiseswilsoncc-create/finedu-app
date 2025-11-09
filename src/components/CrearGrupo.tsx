import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const CrearGrupo: React.FC<{ usuario: any }> = ({ usuario }) => {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correos, setCorreos] = useState<string[]>([]);
  const [roles, setRoles] = useState<{ [correo: string]: "admin" | "participante" }>({});

  const agregarCorreo = () => {
    const correoLimpio = nuevoCorreo.trim().toLowerCase();
    if (
      correoLimpio &&
      !correos.includes(correoLimpio) &&
      correoLimpio !== usuario.correo
    ) {
      setCorreos([...correos, correoLimpio]);
      setRoles({ ...roles, [correoLimpio]: "participante" });
      setNuevoCorreo("");
    }
  };

  const eliminarCorreo = (correo: string) => {
    setCorreos(correos.filter((c) => c !== correo));
    const updatedRoles = { ...roles };
    delete updatedRoles[correo];
    setRoles(updatedRoles);
  };

  const cambiarRol = (correo: string, nuevoRol: "admin" | "participante") => {
    setRoles({ ...roles, [correo]: nuevoRol });
  };

  const validarUsuarios = async () => {
    const todosLosCorreos = [usuario.correo, ...correos];
    if (todosLosCorreos.length < 2 || todosLosCorreos.length > 100) {
      alert("⚠️ El grupo debe tener entre 2 y 100 participantes.");
      return false;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("correo")
      .in("correo", todosLosCorreos);

    if (error) {
      alert("❌ Error al validar usuarios.");
      return false;
    }

    const registrados = data.map((u) => u.correo);
    const faltantes = todosLosCorreos.filter((c) => !registrados.includes(c));
    if (faltantes.length > 0) {
      alert(`⚠️ Los siguientes correos no están registrados en Finedu:\n${faltantes.join("\n")}`);
      return false;
    }

    const rolesFinales = { ...roles, [usuario.correo]: "admin" };
    const tieneAdmin = Object.values(rolesFinales).includes("admin");
    if (!tieneAdmin) {
      alert("⚠️ Debe haber al menos un administrador en el grupo.");
      return false;
    }

    return true;
  };

  const crearGrupo = async () => {
    if (!nombreGrupo.trim()) {
      alert("⚠️ Debes ingresar un nombre para el grupo.");
      return;
    }

    const validado = await validarUsuarios();
    if (!validado) return;

    const { data: grupoData, error: grupoError } = await supabase
      .from("grupos_ahorro")
      .insert([
        {
          nombre: nombreGrupo.trim(),
          administrador: usuario.correo,
          creado_en: new Date().toISOString(),
        },
      ])
      .select();

    if (grupoError || !grupoData) {
      alert("❌ No se pudo crear el grupo.");
      return;
    }

    const grupoId = grupoData[0].id;
    const todosLosCorreos = [usuario.correo, ...correos];
    const rolesFinales = { ...roles, [usuario.correo]: "admin" };

    const miembros = todosLosCorreos.map((correo) => ({
      grupo_id: grupoId,
      correo,
      rol: rolesFinales[correo],
    }));

    const { error: miembrosError } = await supabase
      .from("miembros_grupo")
      .insert(miembros);

    if (miembrosError) {
      alert("❌ Error al registrar los participantes.");
      return;
    }

    alert(`✅ Grupo "${nombreGrupo}" creado exitosamente.`);
    setNombreGrupo("");
    setCorreos([]);
    setRoles({});
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🛠️ Crear nuevo grupo</h2>

      <label>
        Nombre del grupo:
        <input
          type="text"
          value={nombreGrupo}
          onChange={(e) => setNombreGrupo(e.target.value)}
          placeholder="Ej: Meta Familiar 2025"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
        />
      </label>

      <div style={{ marginTop: "1.5rem" }}>
        <label>
          Agregar integrante (correo):
          <input
            type="email"
            value={nuevoCorreo}
            onChange={(e) => setNuevoCorreo(e.target.value)}
            placeholder="Ej: persona@email.com"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </label>
        <button
          onClick={agregarCorreo}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#7f8c8d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ➕ Agregar integrante
        </button>
      </div>

      {correos.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4>👥 Integrantes agregados:</h4>
          <ul>
            {correos.map((correo, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                {correo} — Rol:{" "}
                <select
                  value={roles[correo]}
                  onChange={(e) =>
                    cambiarRol(correo, e.target.value as "admin" | "participante")
                  }
                >
                  <option value="participante">Participante</option>
                  <option value="admin">Administrador</option>
                </select>
                <button
                  onClick={() => eliminarCorreo(correo)}
                  style={{
                    marginLeft: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#c0392b",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={crearGrupo}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2980b9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Crear grupo
      </button>
    </div>
  );
};

export default CrearGrupo;
