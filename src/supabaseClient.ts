// finedu-app/src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Usamos variables de entorno públicas para que estén disponibles en el navegador
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
