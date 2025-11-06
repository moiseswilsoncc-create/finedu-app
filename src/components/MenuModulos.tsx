const MenuModulos = () => {
  const usuarioId = localStorage.getItem("usuarioId");
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  const [nuevasOfertas, setNuevasOfertas] = useState(0);
  const [modulosPermitidos, setModulosPermitidos] = useState<string[] | null>(null);

  useEffect(() => {
    const verificarPermisos = async () => {
      try {
        if (!usuarioId) {
          // Fallback: todos los módulos
          setModulosPermitidos(todosLosModulos.map(m => m.ruta));
          return;
        }

        const { data, error } = await supabase
          .from("permisos_usuario")
          .select("modulo, permiso")
          .eq("usuario_id", usuarioId);

        if (error) {
          console.error("Error al cargar permisos:", error.message);
          setModulosPermitidos(todosLosModulos.map(m => m.ruta));
          return;
        }

        const rutasHabilitadas = (data || [])
          .filter((p: any) => String(p.permiso).toLowerCase() === "true")
          .map((p: any) => p.modulo);

        // Si no hay registros, fallback a todos
        setModulosPermitidos(
          rutasHabilitadas.length > 0 ? rutasHabilitadas : todosLosModulos.map(m => m.ruta)
        );
      } catch (e: any) {
        console.error("Excepción verificando permisos:", e?.message || e);
        setModulosPermitidos(todosLosModulos.map(m => m.ruta));
      }
    };

    verificarPermisos();
  }, [usuarioId, tipoUsuario]);

  if (modulosPermitidos === null) {
    return (
      <div className="menu-modulos-container">
        <h2>📂 Accede a tus módulos</h2>
        <p>Cargando módulos...</p>
      </div>
    );
  }

  const permitidosSet = new Set(modulosPermitidos);
  const modulosFiltrados = todosLosModulos.filter(m => permitidosSet.has(m.ruta));

  return (
    <div className="menu-modulos-container">
      <h2>📂 Accede a tus módulos</h2>
      {modulosFiltrados.length === 0 ? (
        <p>⚠️ No tienes módulos habilitados aún.</p>
      ) : (
        <div className="modulo-grid">
          {modulosFiltrados.map((modulo, index) => (
            <Link key={index} to={modulo.ruta} className="btn-modulo">
              {modulo.label}
              {modulo.ruta === "/panel-ofertas" && nuevasOfertas > 0 && (
                <span className="badge-campana">{nuevasOfertas}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
