import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPerfil } from "../context/UserContext"; // 👈 Integración con UserContext

interface Props {
  usuario: { correo: string };
  correos: string[];
  montos: { [correo: string]: number };
  nombres: { [correo: string]: string }; // 👈 Nombre completo recuperado
  nuevoCorreo: string;
  setNuevoCorreo: (v: string) => void;
  agregarCorreo: (correo: string) => Promise<void>;
  crearGrupo: () => void;
  aporteMensual: number;
  setNombres: React.Dispatch<React.SetStateAction<{ [correo: string]: string }>>;
  setMontos: React.Dispatch<React.SetStateAction<{ [correo: string]: number }>>;
  usuariosMap?: { [correo: string]: string };
  setUsuariosMap?: React.Dispatch<React.SetStateAction<{ [correo: string]: string }>>;
}

const BloqueParticipantes: React.FC<Props> = ({
  usuario,
  correos,
  montos,
  nombres,
  nuevoCorreo,
  setNuevoCorreo,
  agregarCorreo,
  crearGrupo,
}) => {
  const navigate = useNavigate();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const { perfil } = useUserPerfil(); // 👈 Obtenemos nombre real del admin

  // 🛡️ FUNCIÓN DE BLINDAJE DE MONEDA
  // Esto evita el error "toLocaleString of undefined"
  const formatoPeso = (valor?: number) => {
    if (valor === undefined || valor === null || isNaN(valor)) return "$ 0";
    return valor.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    });
  };

  const toggleSeleccion = (correo: string) => {
    setSeleccionados((prev) =>
      prev.includes(correo) ? prev.filter((c) => c !== correo) : [...prev, correo]
    );
  };

  const editarSeleccionado = () => {
    alert("✏️ Función de edición pendiente.");
  };

  const eliminarSeleccionados = () => {
    setSeleccionados([]);
    alert("🗑️ Eliminación pendiente de implementación en el padre.");
  };

  const handleAgregarCorreo = () => {
    const correoLimpio = nuevoCorreo.trim().toLowerCase();

    if (
      correoLimpio &&
      !correos.includes(correoLimpio) &&
      correoLimpio !== usuario.correo
    ) {
      agregarCorreo(correoLimpio);
    }
  };

  // Definimos el monto del admin de forma segura
  const montoAdmin = montos && usuario.correo ? montos[usuario.correo] : 0;

  return (
    <>
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
      >
        <h3 className="text-lg font-bold mb-4 text-gray-700">👥 Integrantes del grupo</h3>

        <div style={{ marginBottom: "1.5rem" }}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Agregar participante por correo:
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              style={{ 
                flex: 1, 
                padding: "0.5rem", 
                border: "1px solid #d1d5db", 
                borderRadius: "0.375rem" 
              }}
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
            <button 
              onClick={handleAgregarCorreo}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left">☑</th>
                <th className="p-3 text-left">Correo</th>
                <th className="p-3 text-left">Nombre Apellido</th>
                <th className="p-3 text-right">Total cuota mensual</th>
              </tr>
            </thead>
            <tbody>
              {/* FILA ADMINISTRADOR (TÚ) */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(usuario.correo)}
                    onChange={() => toggleSeleccion(usuario.correo)}
                    disabled
                    title="El administrador no se puede eliminar"
                  />
                </td>
                <td className="p-3 text-gray-600">{usuario.correo}</td>
                <td className="p-3 font-semibold text-blue-800">
                  {perfil
                    ? `${perfil.nombre} ${perfil.apellido} (Admin)`
                    : "Cargando..."}
                </td>
                <td className="p-3 text-right font-mono font-medium">
                  {formatoPeso(montoAdmin)}
                </td>
              </tr>

              {/* FILAS PARTICIPANTES */}
              {correos.map((correo) => {
                 const montoParticipante = montos ? (montos[correo] || 0) : 0;
                 return (
                  <tr key={correo} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(correo)}
                        onChange={() => toggleSeleccion(correo)}
                      />
                    </td>
                    <td className="p-3 text-gray-600">{correo}</td>
                    <td className="p-3">
                      {nombres[correo] || <span className="text-gray-400 italic">—</span>}
                    </td>
                    <td className="p-3 text-right font-mono font-medium">
                       {/* Aquí usamos formatoPeso para evitar el crash */}
                       {formatoPeso(montoParticipante)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "flex-end"
          }}
        >
          <button 
            onClick={editarSeleccionado}
            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded border border-blue-200 text-sm"
          >
            ✏️ Editar
          </button>
          <button 
            onClick={eliminarSeleccionados}
            className="text-red-600 hover:bg-red-50 px-3 py-1 rounded border border-red-200 text-sm"
          >
            🗑️ Eliminar
          </button>
          <button 
            onClick={crearGrupo}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold shadow-sm"
          >
            ✅ Crear grupo
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button 
          onClick={() => navigate("/panel-usuario")}
          className="text-gray-500 hover:text-gray-800 underline"
        >
          🏠 Volver al menú principal
        </button>
      </div>
    </>
  );
};

export default BloqueParticipantes;
