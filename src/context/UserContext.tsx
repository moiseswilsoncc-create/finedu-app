import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client"; // Asegura que la ruta sea correcta

type PerfilUsuario = {
  id: string; // Agregué ID por si lo necesitas para buscar datos
  nombre: string;
  apellido: string;
  correo: string;
};

// Definimos qué va a devolver el contexto: Perfil Y estado de carga
type UserContextType = {
  perfil: PerfilUsuario | null;
  cargando: boolean;
};

// Inicializamos con un valor por defecto seguro
const UserContext = createContext<UserContextType>({ perfil: null, cargando: true });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cargando, setCargando] = useState(true); // 🚦 EL SEMÁFORO IMPORTANTE

  // Función auxiliar para buscar datos en la BD
  const fetchPerfil = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, apellido, correo")
        .eq("id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error buscando perfil:", error);
      }

      if (data) {
        setPerfil({
          id: userId,
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
        });
      } else {
        // Si existe en Auth pero no en BD, al menos guardamos el correo
        console.warn("Usuario sin perfil en tabla 'usuarios'");
        setPerfil({ id: userId, nombre: '', apellido: '', correo: email });
      }
    } catch (error) {
      console.error("Error inesperado en fetchPerfil:", error);
    } finally {
      setCargando(false); // 🟢 ¡YA TERMINAMOS DE CARGAR!
    }
  };

  useEffect(() => {
    // 1. Chequeo inicial
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchPerfil(session.user.id, session.user.email || "");
      } else {
        setPerfil(null);
        setCargando(false);
      }
    };

    checkSession();

    // 2. Listener de cambios (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Solo buscamos si el perfil no está ya cargado o si cambió el usuario
        setPerfil((prev) => {
            if(prev?.id === session.user.id) return prev; // Evita recargas infinitas
            fetchPerfil(session.user.id, session.user.email || "");
            return prev; 
        });
      } else {
        setPerfil(null);
        setCargando(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    // Exportamos AMBOS valores
    <UserContext.Provider value={{ perfil, cargando }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserPerfil = () => useContext(UserContext);
