import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const supabase = createClient("https://ftsbnorudtcyrrubutt.supabase.co", "TU_API_KEY");

const ActivarColaborador: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [estado, setEstado] = useState<"validando" | "invalido" | "formulario" | "activado">("validando");
  const [formulario, setFormulario] = useState({
    correo: "",
    rol: "",
    pais: "Chile",
    contraseña: ""
  });

  useEffect(() => {
    const validarToken = async () => {
      if (!token) return setEstado("invalido");

      const { data, error } = await supabase
        .from("tokens_activacion")
        .select("*")
        .eq("token", token)
        .eq("usado", false)
        .gt("fecha_expiracion", new Date().toISOString())
        .single();

      if (error || !data) {
        setEstado("invalido");
      } else {
        setFormulario((prev) => ({
          ...prev,
          correo: data.correo,
          rol: data.rol
        }));
        setEstado("formulario");
      }
    };

    validarToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { correo, rol, pais, contraseña } = formulario;

    const { error: updateError } = await supabase
      .from("colaboradores")
      .update({
        pais,
        activo: true,
        fecha_ingreso: new Date().toISOString()
      })
      .eq("correo", correo);

    const { error: tokenError } = await supabase
      .from("tokens_activacion")
      .update({
        usado: true,
        fecha_uso: new Date().toISOString()
      })
      .eq("token", token);

    if (updateError || tokenError) {
      console.error("❌ Error al activar cuenta:", updateError || tokenError);
      return;
    }

    setEstado("activado");
    setTimeout(() => navigate("/panel-colaboradores"), 3000);
  };

  if (estado === "validando") return <p>🔄 Validando token de activación...</p>;
  if (estado === "invalido") return <p>❌ Token inválido o expirado.</p>;
  if (estado === "activado") return <p>✅ Cuenta activada correctamente. Redirigiendo...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "2rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🔐 Activación de cuenta</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <input type="text" name="correo" value={formulario.correo} disabled style={inputStyle} />
        <select name="pais" value={formulario.pais} onChange={handleChange} required style={inputStyle}>
          <option value="Chile">Chile</option>
          <option value="México">México</option>
          <option value="Perú">Perú</option>
        </select>
        <select name="rol" value={formulario.rol} disabled style={inputStyle}>
          <option value="colaborador">Colaborador</option>
          <option value="institucional">Institucional</option>
        </select>
        <input type="password" name="contraseña" value={formulario.contraseña} onChange={handleChange} placeholder="Crear contraseña" required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Activar cuenta</button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "0.8rem",
  backgroundColor: "#27ae60",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer"
};

export default ActivarColaborador;
