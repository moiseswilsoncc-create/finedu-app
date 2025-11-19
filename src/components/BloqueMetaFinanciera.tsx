import React, { useEffect } from "react";

interface Props {
  metaTotal: number;
  plazoMeses: number;
  metaIndividual: number;
  aporteMensual: number;
  setMetaTotal: (val: number) => void;
  setPlazoMeses: (val: number) => void;
  setFechaTermino?: (val: string) => void;
}

const BloqueMetaFinanciera: React.FC<Props> = ({
  metaTotal,
  plazoMeses,
  metaIndividual,
  aporteMensual,
  setMetaTotal,
  setPlazoMeses,
  setFechaTermino,
}) => {
  // 🛡️ FUNCIÓN DE SEGURIDAD PARA MONEDA
  // Evita el error "toLocaleString of undefined"
  const formatoMoneda = (valor?: number) => {
    if (valor === undefined || valor === null || isNaN(valor)) return "$ 0";
    return valor.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    });
  };

  // Cálculo automático de fechas
  useEffect(() => {
    const calcularFechas = () => {
      const inicio = new Date();
      const termino = new Date(inicio);
      
      // Aseguramos que plazoMeses sea un número válido, mínimo 1
      const mesesSeguros = plazoMeses > 0 ? plazoMeses : 1;
      
      termino.setMonth(inicio.getMonth() + mesesSeguros);
      
      // Formateamos para mostrar en pantalla (Nombre Mes Año)
      const opcionesFecha: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
      const textoTermino = termino.toLocaleDateString('es-CL', opcionesFecha);
      
      // Si tenemos el setter para guardar la fecha exacta en BD (ISO)
      if (setFechaTermino) {
        setFechaTermino(termino.toISOString());
      }
    };

    calcularFechas();
  }, [plazoMeses, setFechaTermino]);

  // Fecha inicio visual
  const fechaInicioTexto = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  
  // Fecha término visual aproximada
  const fechaFinEstimada = new Date();
  fechaFinEstimada.setMonth(new Date().getMonth() + (plazoMeses || 1));
  const fechaFinTexto = fechaFinEstimada.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

  return (
    <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-yellow-600 flex items-center gap-2">
        💰 Meta y planificación financiera
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INPUTS DE ENTRADA */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto meta grupal (CLP):
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={metaTotal || ""}
              onChange={(e) => setMetaTotal(Number(e.target.value))}
              placeholder="Ej: 1000000"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formatoMoneda(metaTotal)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meses de ahorro:
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={plazoMeses || ""}
              onChange={(e) => setPlazoMeses(Number(e.target.value))}
              placeholder="Ej: 12"
              min="1"
            />
          </div>
        </div>

        {/* RESUMEN CALCULADO */}
        <div className="bg-yellow-50 p-4 rounded-md space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <span className="font-semibold">Inicio automático:</span> 
            <span className="capitalize">{fechaInicioTexto}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">🏁</span>
            <span className="font-semibold">Término estimado:</span>
            <span className="capitalize">{fechaFinTexto}</span>
          </div>

          <div className="border-t border-yellow-200 my-2 pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎯</span>
              <span className="font-semibold">Meta individual total:</span>
              <span className="font-bold text-gray-900">{formatoMoneda(metaIndividual)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xl">🗓</span>
              <span className="font-semibold">Aporte mensual por persona:</span>
              <span className="font-bold text-blue-700 text-lg">{formatoMoneda(aporteMensual)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloqueMetaFinanciera;
