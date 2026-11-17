
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase configuration missing. Check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase URL loaded:", !!import.meta.env.VITE_SUPABASE_URL);
console.log(
  "Supabase key loaded:",
  !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
console.log(
  "Key type:",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith("sb_publishable_")
);