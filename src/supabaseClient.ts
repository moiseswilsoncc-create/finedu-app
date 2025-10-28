// finedu-app/src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Usamos variables de entorno públicas para Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
