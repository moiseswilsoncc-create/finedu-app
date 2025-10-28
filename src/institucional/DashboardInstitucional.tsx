import React, { useEffect } from "react";

const DashboardInstitucional: React.FC = () => {
  useEffect(() => {
    console.log("✅ DashboardInstitucional montado");
  }, []);

  return (
    <div style={{ padding: "2rem", color: "green", fontSize: "1.5rem" }}>
      ✅ DashboardInstitucional cargado correctamente
    </div>
  );
};

export default DashboardInstitucional;
