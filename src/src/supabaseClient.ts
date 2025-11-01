import { createClient } from "@supabase/supabase-js";

// 🔐 Claves institucionales activas
const SUPABASE_URL = "https://ftsnonrudtcyrruubutt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBiYXNlIiwic3ViIjoiYXVub24iLCJ2ZXJzaW9uIjoxLCJpYXQiOjE2NzUwODI1NzIsImV4cCI6MTY4MzYyODU3MiwiYXR0cmlidXRlcyI6eyJwcm9qZWN0X2lkIjoiY2xpY2tzdGFydGVyIn19.qT5600RcYkK1R8LsNi14t1ZBVf1ZanfGkxd8XoUeg9sP";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("❌ Faltan variables de entorno para Supabase en frontend.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
