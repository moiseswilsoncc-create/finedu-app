import React from "react";

interface Props {
  nombreGrupo: string;
  pais: string;
  ciudad: string;
  comuna: string;
  setNombreGrupo: (v: string) => void;
  setPais: (v: string) => void;
  setCiudad: (v: string) => void;
  setComuna: (v: string) => void;
}

const BloqueDatosGrupo: React.FC<Props> = ({
  nombreGrupo,
  pais,
  ciudad,
  comuna,
  setNombreGrupo,
  setPais,
  setCiudad,
  setComuna,
}) => {
  return (
    <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
        📌 Datos generales del grupo
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del grupo:
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={nombreGrupo || ""}
            onChange={(e) => setNombreGrupo(e.target.value)}
            placeholder="Ej: Ahorro Familiar 2025"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            País:
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={pais || ""}
            onChange={(e) => setPais(e.target.value)}
            placeholder="Ej: Chile"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={ciudad || ""}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Ej: Santiago"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comuna:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={comuna || ""}
              onChange={(e) => setComuna(e.target.value)}
              placeholder="Ej: Providencia"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloqueDatosGrupo;
