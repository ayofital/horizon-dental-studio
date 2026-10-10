import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseConfigurationError extends Error {
    constructor() {
        super("Booking persistence requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the server environment.");
        this.name = "SupabaseConfigurationError";
    }
}

let client: SupabaseClient | undefined;

export function getSupabaseServerClient() {
    if (client) return client;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url?.trim() || !key?.trim()) throw new SupabaseConfigurationError();
    try {
        const parsed = new URL(url);
        if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new SupabaseConfigurationError();
        client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    } catch {
        throw new SupabaseConfigurationError();
    }
    return client;
}
