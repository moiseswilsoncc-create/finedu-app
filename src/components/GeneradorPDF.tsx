import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Participante } from "../types";
import { calcularEdad } from "../utils/calcularEdad"; // Asegúrate de tener esta función modularizada

type Props = {
  participantes: Participante[];
  metaGrupal: number;
};

function GeneradorPDF({ participantes, metaGrupal }: Props) {
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Informe Institucional Finedu LATAM", 15, 20);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 15, 28);
    doc.text(`Meta grupal declarada: $${metaGrupal.toLocaleString()}`, 15, 34);
    doc.text(`Participantes activos: ${participantes.length}`, 15, 40);

    const totalAhorro = participantes.reduce(
      (total, p) => total + (p.ingresos - p.egresos),
      0
    );
    const promedioAhorro =
      participantes.length > 0 ? totalAhorro / participantes.length : 0;

    doc.text(`Ahorro total acumulado: $${totalAhorro.toLocaleString()}`, 15, 46);
    doc.text(`Promedio de ahorro por persona: $${promedioAhorro.toLocaleString()}`, 15, 52);

    // Segmentación por edad
    const gruposEdad = {
      "10–20": 0,
      "21–35": 0,
      "36–60": 0,
      "60+": 0,
    };
    const ahorroPorEdad: Record<string, number> = {
      "10–20": 0,
      "21–35": 0,
      "36–60": 0,
      "60+": 0,
    };

    const ciudades: Record<string, number> = {};
    const comunas: Record<string, number> = {};
    const ahorroPorCiudad: Record<string, number> = {};
    const ahorroPorComuna: Record<string, number> = {};

    participantes.forEach((p) => {
      const edad = calcularEdad(p.fechaNacimiento);
      const ahorro = p.ingresos - p.egresos;

      if (edad <= 20) gruposEdad["10–20"]++, (ahorroPorEdad["10–20"] += ahorro);
      else if (edad <= 35) gruposEdad["21–35"]++, (ahorroPorEdad["21–35"] += ahorro);
      else if (edad <= 60) gruposEdad["36–60"]++, (ahorroPorEdad["36–60"] += ahorro);
      else gruposEdad["60+"]++, (ahorroPorEdad["60+"] += ahorro);

      if (p.ciudad) {
        ciudades[p.ciudad] = (ciudades[p.ciudad] || 0) + 1;
        ahorroPorCiudad[p.ciudad] = (ahorroPorCiudad[p.ciudad] || 0) + ahorro;
      }

      if (p.comuna) {
        comunas[p.comuna] = (comunas[p.comuna] || 0) + 1;
        ahorroPorComuna[p.comuna] = (ahorroPorComuna[p.comuna] || 0) + ahorro;
      }
    });

    autoTable(doc, {
      startY: 60,
      head: [["Rango etario", "Participantes", "Ahorro total"]],
      body: Object.keys(gruposEdad).map((rango) => [
        rango,
        gruposEdad[rango],
        `$${ahorroPorEdad[rango].toLocaleString()}`,
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Ciudad", "Participantes", "Ahorro total"]],
      body: Object.keys(ciudades).map((ciudad) => [
        ciudad,
        ciudades[ciudad],
        `$${ahorroPorCiudad[ciudad].toLocaleString()}`,
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Comuna", "Participantes", "Ahorro total"]],
      body: Object.keys(comunas).map((comuna) => [
        comuna,
        comunas[comuna],
        `$${ahorroPorComuna[comuna].toLocaleString()}`,
      ]),
    });

    doc.save("informe_finedu.pdf");
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <button onClick={generarPDF}>📄 Exportar informe PDF</button>
    </div>
  );
}

export default GeneradorPDF;
