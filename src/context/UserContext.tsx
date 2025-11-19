import { createContext, useContext, useEffect, useState } from "react";
// 👇 ESTA ES LA RUTA CORRECTA PARA TU PROYECTO
import { supabase } from "../supabaseClient"; 

// Definimos la estructura del perfil
type PerfilUsuario = {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
};

// Definimos qué datos tendrá el contexto (Perfil + Estado de Carga)
type UserContextType = {
  perfil: PerfilUsuario | null;
  cargando: boolean;
};

// Inicializamos el contexto
const UserContext = createContext<UserContextType>({ 
  perfil: null, 
  cargando: true 
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cargando, setCargando] = useState(true); // 🚦 Semáforo iniciado en ROJO

  // Función auxiliar para traer los datos de la BD
  const fetchPerfil = async (userId: string, email: string) => {
    try {
      // Buscamos en la tabla 'usuarios'
      const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, apellido, correo")
        .eq("id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error buscando perfil:", error);
      }

      if (data) {
        // ✅ Usuario encontrado en BD
        setPerfil({
          id: userId,
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
        });
      } else {
        // ⚠️ Usuario en Auth pero no en BD (fallback)
        console.warn("Usuario autenticado sin registro en tabla 'usuarios'");
        setPerfil({ 
          id: userId, 
          nombre: '', 
          apellido: '', 
          correo: email 
        });
      }
    } catch (error) {
      console.error("Error inesperado en fetchPerfil:", error);
    } finally {
      setCargando(false); // 🟢 Semáforo en VERDE (Ya terminamos)
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Chequeo inicial al cargar la app
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          if (mounted) await fetchPerfil(session.user.id, session.user.email || "");
        } else {
          if (mounted) {
            setPerfil(null);
            setCargando(false);
          }
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        if (mounted) setCargando(false);
      }
    };

    checkSession();

    // 2. Escuchar cambios (Login, Logout, Auto-refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Si cambia la sesión, actualizamos el perfil
        fetchPerfil(session.user.id, session.user.email || "");
      } else {
        // Si se cierra la sesión, limpiamos todo
        setPerfil(null);
        setCargando(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ perfil, cargando }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useUserPerfil = () => useContext(UserContext);
