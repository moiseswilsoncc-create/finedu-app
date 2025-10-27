import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportadorPDFProps {
  titulo: string;
  secciones: string[];
}

const ExportadorPDF: React.FC<ExportadorPDFProps> = ({ titulo, secciones }) => {
  const generarPDF = () => {
    const doc = new jsPDF();

    // Encabezado institucional
    doc.setFontSize(18);
    doc.setTextColor("#2c3e50");
    doc.text(titulo, 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Informe generado automáticamente por Finedu LATAM", 14, 30);

    // Listado de secciones
    secciones.forEach((seccion, index) => {
      doc.text(`${index + 1}. ${seccion}`, 14, 40 + index * 8);
    });

    // Tabla resumen
    autoTable(doc, {
      startY: 40 + secciones.length * 8 + 10,
      head: [["Sección", "Descripción"]],
      body: secciones.map((s, i) => [`${i + 1}`, s]),
      theme: "grid",
      styles: {
        fontSize: 10,
        halign: "left",
        valign: "middle",
        cellPadding: 4
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: "bold"
      }
    });

    // Pie institucional
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("© 2025 Finedu LATAM — Plataforma de educación y autonomía financiera", 14, doc.internal.pageSize.height - 10);

    doc.save("InformeInstitucional_Finedu.pdf");
  };

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <button
        onClick={generarPDF}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2c3e50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
      >
        📄 Descargar informe en PDF
      </button>
    </div>
  );
};

export default ExportadorPDF;
