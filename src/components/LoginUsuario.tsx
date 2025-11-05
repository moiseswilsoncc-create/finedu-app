import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginUsuario: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [bienvenido, setBienvenido] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Detectar si viene de confirmación de Supabase (hash con type=signup)
    if (location.hash.includes("type=signup")) {
      setBienvenido(true);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clave.length < 6) {
      navigate("/error-acceso", {
        state: {
          mensaje: "La clave debe tener al menos 6 caracteres.",
          origen: "acceso",
        },
      });
      return;
    }

    setEnviando(true);

    try {
      // 1. Intentar login en Supabase Auth
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: clave,
      });

      console.log("Resultado login:", data, supabaseError);

      if (supabaseError || !data.user) {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);

        if (nuevosIntentos >= 3) {
          // 🔒 Bloqueo y envío de correo de recuperación
          await supabase.auth.resetPasswordForEmail(correo, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://finedu-app-dxhr.vercel.app"}/nueva-clave`,
          });
          navigate("/error-acceso", {
            state: {
              mensaje:
                "Has superado el número de intentos. Te enviamos un correo para restablecer tu clave.",
              origen: "acceso",
            },
          });
          return;
        }

        navigate("/error-acceso", {
          state: {
            mensaje: "Correo o clave incorrectos. Intenta nuevamente.",
            origen: "acceso",
          },
        });
        return;
      }

      // 2. Validar si el correo está confirmado
      if (!data.user.email_confirmed_at) {
        navigate("/error-acceso", {
          state: {
            mensaje: "Tu cuenta aún no está confirmada. Revisa tu correo y confirma antes de ingresar.",
            origen: "acceso",
          },
        });
        return;
      }

      const user = data.user;

      // 3. Upsert en tabla usuarios (perfil básico)
      const { error: errorUsuarios } = await supabase
        .from("usuarios")
        .upsert(
          {
            id: user.id,
            correo: user.email,
            nombre: user.user_metadata?.nombre || "",
            apellido: user.user_metadata?.apellido || "",
            pais: user.user_metadata?.pais || "Chile",
            comuna: user.user_metadata?.comuna || "",
            fechaNacimiento: user.user_metadata?.fechaNacimiento || null,
          },
          { onConflict: "id" }
        );

      if (errorUsuarios) {
        console.error("❌ Error al registrar en usuarios:", errorUsuarios.message, errorUsuarios.details);
        navigate("/error-acceso", {
          state: { mensaje: "No se pudo registrar el perfil de usuario.", origen: "login" },
        });
        return;
      }

      // 4. Upsert en tabla usuarios_activos
      const { error: errorActivos } = await supabase
        .from("usuarios_activos")
        .upsert(
          {
            usuario_id: user.id,
            correo: user.email,
            nombre: `${user.user_metadata?.nombre || ""} ${user.user_metadata?.apellido || ""}`,
            rol: "usuario",
            pais: user.user_metadata?.pais || "Chile",
            comuna: user.user_metadata?.comuna || "",
            esActivo: true,
            fechaNacimiento: user.user_metadata?.fechaNacimiento || null,
          },
          { onConflict: "usuario_id" }
        );

      if (errorActivos) {
        console.error("❌ Error al registrar en usuarios_activos:", errorActivos.message, errorActivos.details);
        navigate("/error-acceso", {
          state: { mensaje: "No se pudo activar el usuario.", origen: "login" },
        });
        return;
      }

      // 5. Guardar datos en localStorage
      localStorage.setItem("usuarioId", user.id);
      localStorage.setItem("correoUsuario", correo);
      localStorage.setItem("nombreUsuario", user.user_metadata?.nombre || correo.split("@")[0]);
      localStorage.setItem("tipoUsuario", "usuario");
      localStorage.setItem("logueado", "true");

      // 🚀 Redirigir al panel de usuario
      navigate("/panel-usuario");
    } catch (err: any) {
      console.error("❌ Error inesperado en login:", err);
      navigate("/error-acceso", {
        state: {
          mensaje: "Error inesperado al intentar iniciar sesión.",
          origen: "acceso",
        },
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fefefe",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h3 style={{ color: "#2c3e50" }}>🔐 Acceso de usuario</h3>

      {bienvenido && (
        <div
          style={{
            backgroundColor: "#eafaf1",
            border: "1px solid #2ecc71",
            padding: "0.8rem",
            borderRadius: "6px",
            color: "#27ae60",
            fontSize: "0.95rem",
          }}
        >
          🎉 Bienvenido/a, tu correo fue confirmado. Ingresa con tu correo y clave para acceder por primera vez.
        </div>
      )}

      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Clave personal (mínimo 6 caracteres)"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={enviando}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: enviando ? "#ccc" : "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: enviando ? "not-allowed" : "pointer",
        }}
      >
        {enviando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
};

export default LoginUsuario;
