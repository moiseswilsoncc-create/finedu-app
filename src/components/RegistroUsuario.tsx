const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("https://ftsbnorudtcyrrubutt.supabase.co/rest/v1/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2Jub3J1ZHRjeXJydXVidXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEyNjksImV4cCI6MjA3Njc0NzI2OX0.XUeq9bsP_tQ5G0QRcYKAlRIsWG1I4tjZBVfTZanfGKk",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        correo,
        contraseña,
        nombre,
        created_at: new Date().toISOString()
      })
    });

    const data = await response.json();
    console.log("Usuario guardado:", data);
    navigate("/vista-ingreso-usuario");
  } catch (err) {
    console.error("Error al guardar usuario:", err);
    setError("No se pudo registrar el usuario.");
  }
};
