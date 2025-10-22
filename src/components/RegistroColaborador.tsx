function RegistroColaborador() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Registro de nuevo colaborador</h2>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        Este formulario es solo para solicitud de acceso. La institución debe autorizar tu ingreso por correo.
      </p>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
          margin: "auto",
          textAlign: "left"
        }}
      >
        <input type="text" placeholder="Nombre" required />
        <input type="text" placeholder="Apellido" required />
        <input type="text" placeholder="Rol o cargo" required />
        <input type="text" placeholder="Área o departamento" required />
        <input type="text" placeholder="Institución" required />
        <input type="text" placeholder="País" defaultValue="Chile" required />
        <input type="text" placeholder="Ciudad" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Solicitar acceso</button>
      </form>
    </div>
  );
}

export default RegistroColaborador;
