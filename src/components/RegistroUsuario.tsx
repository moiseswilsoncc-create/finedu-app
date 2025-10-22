function RegistroUsuario() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Registro de nuevo usuario</h2>
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px", margin: "auto" }}>
        <input type="text" placeholder="Nombre completo" required />
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default RegistroUsuario;
