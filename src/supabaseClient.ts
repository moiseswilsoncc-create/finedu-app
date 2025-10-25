// src/utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://TU-PROYECTO.supabase.co"; // ← reemplaza con tu URL real
const supabaseAnonKey = "TU-CLAVE-ANONIMA";            // ← reemplaza con tu anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
