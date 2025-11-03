// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// 🔐 Variables de entorno (definidas en .env con prefijo VITE_)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("❌ Faltan variables de entorno para Supabase en frontend.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
