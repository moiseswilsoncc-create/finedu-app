// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Variables adaptadas para Vite (no usar process.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Trazabilidad para validar en consola
console.log("🔍 Supabase URL:", supabaseUrl);
console.log("🔍 Supabase KEY:", supabaseAnonKey);

// ✅ Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
