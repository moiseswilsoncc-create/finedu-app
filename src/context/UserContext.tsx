// context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // ajusta la ruta según tu proyecto

type PerfilUsuario = {
  nombre: string;
  apellido: string;
  correo: string;
};

const UserContext = createContext<PerfilUsuario | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);

  useEffect(() => {
    const getPerfil = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("usuarios")
          .select("nombre, apellido, correo")
          .eq("id", user.id)
          .single();
        if (data) {
          setPerfil({
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
          });
        }
      } else {
        setPerfil(null);
      }
    };

    getPerfil();

    // Escuchar cambios de sesión
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getPerfil();
      } else {
        setPerfil(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={perfil}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserPerfil = () => useContext(UserContext);
