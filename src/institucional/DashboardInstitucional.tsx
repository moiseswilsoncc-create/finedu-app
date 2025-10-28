useEffect(() => {
  console.log("✅ DashboardInstitucional montado");

  const obtenerDatos = async () => {
    try {
      const { data, error } = await supabase
        .from("ahorro_por_region")
        .select("*");

      if (error) {
        console.error("❌ Error al obtener datos:", error.message);
      } else {
        console.log("📊 Datos obtenidos:", data);
        setDatos(data);
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err);
    }
  };

  obtenerDatos();
}, []);
