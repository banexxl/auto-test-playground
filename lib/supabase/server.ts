import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// In Next 15 the cookies() helper returns a Promise, so the createClient()
// helper is async. Use the getAll/setAll cookie pattern recommended for SSR.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(url ?? "", key ?? "", {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as CookieOptions)
          })
        } catch {
          // set() is not supported in Server Components. Middleware refreshes
          // the session, so the next request will see the refreshed cookies.
        }
      },
    },
  })
}
