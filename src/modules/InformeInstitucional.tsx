import React from "react";
import { useDatosFinedu } from "../context/FineduContext"; // contexto centralizado
import GraficoLinea from "../components/Graficos/GraficoLinea";
import TablaResumen from "../components/Tablas/TablaResumen";
import MapaCalor from "../components/Visualizaciones/MapaCalor";
import ExportadorPDF from "../components/Exportador/ExportadorPDF";

const InformeInstitucional: React.FC = () => {
  const {
    ahorroTotal,
    ahorroMensual,
    variacionMensual,
    tendenciaAhorro,
    usuariosActivos,
    usuariosConAhorro,
    usuariosConSimulacion,
    usuariosConMetaCumplida,
    usuariosConEgresosAltos,
    segmentacionEdad,
    segmentacionSexo,
    simuladores,
    distribucionGeografica,
    retencion,
    crecimientoGrupal,
    analisisConversacional,
    estadisticasAvanzadas,
  } = useDatosFinedu();

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>📘 Informe Institucional Finedu</h1>
      <p><em>Versión profesional – Datos consolidados del último mes</em></p>

      {/* 1. Ahorro total */}
      <section>
        <h2>1. Ahorro total</h2>
        <TablaResumen
          datos={[
            ["Total ahorro acumulado", `$${ahorroTotal.toLocaleString("es-CL")}`],
            ["Total ahorro por mes", `$${ahorroMensual.toLocaleString("es-CL")}`],
            ["Variación mensual", `${variacionMensual.toFixed(2)}%`],
          ]}
        />
        <GraficoLinea titulo="Tendencia de ahorro (últimos 6 meses)" datos={tendenciaAhorro} />
      </section>

      {/* 2. Actividad de usuarios */}
      <section>
        <h2>2. Actividad de usuarios</h2>
        <TablaResumen
          datos={[
            ["Usuarios activos", usuariosActivos],
            ["Usuarios con ahorro", usuariosConAhorro],
            ["Usuarios que compararon créditos", usuariosConSimulacion],
            ["Usuarios con meta cumplida", usuariosConMetaCumplida],
            ["Usuarios con egresos > ingresos", usuariosConEgresosAltos],
          ]}
        />
        <TablaResumen titulo="Segmentación por edad" datos={segmentacionEdad} />
        <TablaResumen titulo="Segmentación por sexo" datos={segmentacionSexo} />
      </section>

      {/* 3. Simuladores */}
      <section>
        <h2>3. Simuladores utilizados</h2>
        <TablaResumen datos={simuladores} />
      </section>

      {/* 4. Distribución geográfica */}
      <section>
        <h2>4. Distribución geográfica</h2>
        <TablaResumen datos={distribucionGeografica.tabla} />
        <MapaCalor datos={distribucionGeografica.mapa} />
      </section>

      {/* 5. Retención y crecimiento */}
      <section>
        <h2>5. Retención y crecimiento</h2>
        <TablaResumen datos={retencion} />
        <TablaResumen datos={crecimientoGrupal} />
      </section>

      {/* 6. Análisis conversacional */}
      <section>
        <h2>6. Análisis de conversación financiera</h2>
        <TablaResumen titulo="Instituciones más mencionadas" datos={analisisConversacional.instituciones} />
        <TablaResumen titulo="Temas financieros recurrentes" datos={analisisConversacional.temas} />
        <TablaResumen titulo="Sentimiento general" datos={analisisConversacional.sentimiento} />
        <TablaResumen titulo="Preguntas frecuentes" datos={analisisConversacional.preguntas} />
      </section>

      {/* 7. Estadísticas avanzadas */}
      <section>
        <h2>7. Estadísticas avanzadas</h2>
        <TablaResumen datos={estadisticasAvanzadas.indices} />
        <TablaResumen datos={estadisticasAvanzadas.correlaciones} />
        <TablaResumen datos={estadisticasAvanzadas.proyecciones} />
      </section>

      {/* Exportador */}
      <ExportadorPDF
        titulo="Informe Institucional Finedu"
        secciones={[
          "Ahorro total",
          "Actividad de usuarios",
          "Simuladores utilizados",
          "Distribución geográfica",
          "Retención y crecimiento",
          "Análisis conversacional",
          "Estadísticas avanzadas",
        ]}
      />
    </div>
  );
};

export default InformeInstitucional;
