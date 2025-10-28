import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const DashboardInstitucional: React.FC = () => {
  const [estado, setEstado] = useState("🧪 Supabase importado correctamente");

  useEffect(() => {
    console.log("✅ Componente montado");
    console.log("🔍 Supabase:", supabase);
  }, []);

  return (
    <div style={{ padding: "2rem", fontSize: "1.5rem", color: "#333" }}>
      <p>{estado}</p>
    </div>
  );
};

export default DashboardInstitucional;
