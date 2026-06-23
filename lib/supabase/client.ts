import { createBrowserClient } from "@supabase/ssr"

// The publishable key is safe to ship to the client. The service-role / secret
// key must never appear in NEXT_PUBLIC_* env vars.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
  )
}

export function createClient() {
  return createBrowserClient(url ?? "", key ?? "")
}
