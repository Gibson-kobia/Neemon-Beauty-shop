import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // During build time, warn but allow creation of dummy client to prevent build crashes.
      // At runtime, this dummy client will fail any network request, which is expected behavior
      // when env vars are missing. The developer must provide them.
      if (typeof window === 'undefined') {
          console.warn("Supabase environment variables are missing during SSR/Build. Using placeholder.");
      } else {
          console.error("Supabase environment variables are missing in browser. Requests will fail.");
      }
      client = createClient("https://placeholder.supabase.co", "placeholder-key");
    } else {
      client = createClient(supabaseUrl, supabaseKey);
    }
  }
  return client;
}
