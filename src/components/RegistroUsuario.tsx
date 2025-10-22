function RegistroUsuario() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Registro de nuevo usuario</h2>
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
        <input type="date" placeholder="Fecha de nacimiento" required />
        <input type="text" placeholder="País" defaultValue="Chile" required />
        <input type="text" placeholder="Ciudad" required />
        <input type="text" placeholder="Comuna" required />
        <select required>
          <option value="">Sexo</option>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
          <option value="otro">Otro</option>
        </select>
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default RegistroUsuario;
