// src/utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://supabase.com/dashboard/project/ftsbnorudtcyrruubutt"; // ← reemplaza con tu URL real
const supabaseAnonKey = "Ut!d&4Nrr_BzgJY";            // ← reemplaza con tu anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
