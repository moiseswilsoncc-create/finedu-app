// Archivo: supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// 🧩 Variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ clave institucional

// 🔐 Validación crítica
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Faltan variables de entorno para Supabase.");
  process.exit(1);
}

// 🚀 Cliente Supabase institucional
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
