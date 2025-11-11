const fetchNombreParticipante = async (correo: string) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("nombre, apellido")
    .ilike("correo", correo.trim().toLowerCase())
    .maybeSingle(); // más seguro que .single()

  if (error) {
    console.error("Error Supabase:", error);
  }

  if (!data) return null;

  const nombre = `${data.nombre || ""} ${data.apellido || ""}`.trim();
  return nombre || "—";
};

const handleAgregarCorreo = async () => {
  const correoLimpio = nuevoCorreo.trim().toLowerCase();
  if (
    correoLimpio &&
    !correos.includes(correoLimpio) &&
    correoLimpio !== usuario.correo
  ) {
    const nombreCompleto = await fetchNombreParticipante(correoLimpio);

    if (nombreCompleto === null) {
      alert("⚠️ El correo ingresado no está registrado en Finedu. El participante debe estar registrado para poder unirse al grupo.");
      return;
    }

    setNombres((prev) => ({ ...prev, [correoLimpio]: nombreCompleto }));
    setMontos((prev) => ({ ...prev, [correoLimpio]: aporteMensual }));
    agregarCorreo();
  }
};
