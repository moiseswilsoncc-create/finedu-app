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

    doc.setFontSize(18);
    doc.text(titulo, 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);

    secciones.forEach((seccion, index) => {
      doc.text(`${index + 1}. ${seccion}`, 14, 35 + index * 8);
    });

    autoTable(doc, {
      startY: 35 + secciones.length * 8 + 10,
      head: [["Sección", "Descripción"]],
      body: secciones.map((s, i) => [`${i + 1}`, s]),
      theme: "grid",
      styles: { fontSize: 10 },
    });

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
