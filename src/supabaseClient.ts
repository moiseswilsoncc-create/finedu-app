// src/utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Reemplaza estos valores con los reales desde tu panel Supabase
const supabaseUrl = "https://fineedu-db.supabase.co"; // ✅ URL del proyecto
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // ✅ anon key completa

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
