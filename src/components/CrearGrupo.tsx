import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const CrearGrupo: React.FC<{ usuario: any }> = ({ usuario }) => {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");
  const [pais, setPais] = useState("");
  const [meta, setMeta] = useState<number>(0);
  const [meses, setMeses] = useState<number>(1);
  const [fechaTermino, setFechaTermino] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correos, setCorreos] = useState<string[]>([]);
  const [roles, setRoles] = useState<{ [correo: string]: "admin" | "participante" }>({});
  const [montos, setMontos] = useState<{ [correo: string]: number }>({});

  const fechaCreacion = new Date().toISOString();
  const totalIntegrantes = 1 + correos.length;

  // 🧮 Cálculo equitativo: todos deben aportar lo mismo al final
  const metaIndividual = meta > 0 && totalIntegrantes > 0 ? Math.round(meta / totalIntegrantes) : 0;
  const cuotaMensual = metaIndividual > 0 && meses > 0 ? Math.round(metaIndividual / meses) : 0;

  useEffect(() => {
    const nuevosMontos: any = {};
    correos.forEach((correo) => {
      nuevosMontos[correo] = cuotaMensual;
    });
    nuevosMontos[usuario.correo] = cuotaMensual;
    setMontos(nuevosMontos);
  }, [meta, meses, correos]);

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
    const updatedMontos = { ...montos };
    delete updatedRoles[correo];
    delete updatedMontos[correo];
    setRoles(updatedRoles);
    setMontos(updatedMontos);
  };

  const cambiarRol = (correo: string, nuevoRol: "admin" | "participante") => {
    setRoles({ ...roles, [correo]: nuevoRol });
  };

  const cambiarMonto = (correo: string, nuevoMonto: number) => {
    setMontos({ ...montos, [correo]: nuevoMonto });
  };

  const crearGrupo = async () => {
    if (!nombreGrupo.trim() || !meta || !meses || !fechaTermino) {
      alert("⚠️ Debes completar todos los campos obligatorios.");
      return;
    }

    const todosLosCorreos = [usuario.correo, ...correos];
    const rolesFinales = { ...roles, [usuario.correo]: "admin" };
    const montosFinales = { ...montos, [usuario.correo]: cuotaMensual };

    const { data: usuariosValidos, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("correo")
      .in("correo", todosLosCorreos);

    if (errorUsuarios) {
      alert("❌ Error al validar usuarios.");
      return;
    }

    const registrados = usuariosValidos.map((u) => u.correo);
    const faltantes = todosLosCorreos.filter((c) => !registrados.includes(c));
    if (faltantes.length > 0) {
      alert(`⚠️ Los siguientes correos no están registrados:\n${faltantes.join("\n")}`);
      return;
    }

    const { data: grupoData, error: grupoError } = await supabase
      .from("grupos_ahorro")
      .insert([
        {
          nombre: nombreGrupo.trim(),
          ciudad,
          comuna,
          pais,
          meta,
          meses,
          monto_mensual: cuotaMensual,
          fecha_creacion: fechaCreacion,
          fecha_termino: fechaTermino,
          administrador: usuario.correo,
        },
      ])
      .select();

    if (grupoError || !grupoData) {
      alert("❌ No se pudo crear el grupo.");
      return;
    }

    const grupoId = grupoData[0].id;
    const miembros = todosLosCorreos.map((correo) => ({
      grupo_id: grupoId,
      correo,
      rol: rolesFinales[correo],
      monto_asignado: cuotaMensual,
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
    setCiudad("");
    setComuna("");
    setPais("");
    setMeta(0);
    setMeses(1);
    setFechaTermino("");
    setCorreos([]);
    setRoles({});
    setMontos({});
  };
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🛠️ Crear nuevo grupo de ahorro</h2>

      <label>Nombre del grupo:</label>
      <input value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} />

      <label>Ciudad:</label>
      <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} />

      <label>Comuna:</label>
      <input value={comuna} onChange={(e) => setComuna(e.target.value)} />

      <label>País:</label>
      <input value={pais} onChange={(e) => setPais(e.target.value)} />

      <label>Monto meta grupal (CLP):</label>
      <input type="number" value={meta} onChange={(e) => setMeta(Number(e.target.value))} />

      <label>Meses de ahorro:</label>
      <input type="number" min={1} max={36} value={meses} onChange={(e) => setMeses(Number(e.target.value))} />

      <label>Fecha de término:</label>
      <input type="date" value={fechaTermino} onChange={(e) => setFechaTermino(e.target.value)} />

      <p>💰 Cuota mensual por persona: <strong>${cuotaMensual.toLocaleString("es-CL")}</strong></p>
      <p>🎯 Meta individual total: <strong>${metaIndividual.toLocaleString("es-CL")}</strong></p>

      <hr />
      <h3>👥 Participantes del grupo</h3>

      <label>Agregar integrante (correo):</label>
      <input type="email" value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)} />
      <button onClick={agregarCorreo}>➕ Agregar</button>

      <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Monto mensual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {[usuario.correo, ...correos].map((correo, i) => (
            <tr key={correo}>
              <td>{i + 1}</td>
              <td>{correo}</td>
              <td>
                {correo === usuario.correo ? (
                  "Administrador"
                ) : (
                  <select
                    value={roles[correo]}
                    onChange={(e) =>
                      cambiarRol(correo, e.target.value as "admin" | "participante")
                    }
                  >
                    <option value="participante">Participante</option>
                    <option value="admin">Administrador</option>
                  </select>
                )}
              </td>
              <td>
                ${cuotaMensual.toLocaleString("es-CL")}
              </td>
              <td>
                {correo === usuario.correo ? "—" : (
                  <button onClick={() => eliminarCorreo(correo)}>❌</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        ✅ Registrar grupo
      </button>
    </div>
  );
};

export default CrearGrupo;
