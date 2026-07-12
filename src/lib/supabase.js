import { createClient } from "@supabase/supabase-js";

// Le variabili VITE_ sono le uniche esposte al client: qui ci vanno
// SOLO l'URL e la PUBLISHABLE key (sb_publishable_...). Mai la secret.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn(
    "[SE] Variabili Supabase mancanti: imposta VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nel file .env"
  );
}

export const supabase = createClient(url, key);

// Nome del bucket Storage per le foto (creato in Fase 1).
export const PHOTO_BUCKET = "photos";
