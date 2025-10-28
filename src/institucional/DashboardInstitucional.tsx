useEffect(() => {
  console.log("🔍 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("🔍 Supabase KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

  const cargarDatos = async () => {
    const { data, error } = await supabase.from("ahorro_por_region").select("*");
    console.log("📊 Supabase respuesta:", { data, error });

    if (error) {
      setEstado("❌ Error al obtener datos");
    } else if (!data || data.length === 0) {
      setEstado("⚠️ Sin datos disponibles");
    } else {
      setEstado("✅ Datos cargados correctamente");
      setDatos(data);
    }
  };

  cargarDatos();
}, []);
