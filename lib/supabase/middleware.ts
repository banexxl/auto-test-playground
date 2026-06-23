import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Routes that do not require a session.
const PUBLIC_EXACT = ["/sign-in"]
const PUBLIC_PREFIXES = ["/_next", "/api/auth/sign-out", "/auth/callback"]

function isPublic(pathname: string) {
  if (PUBLIC_EXACT.includes(pathname)) return true
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true
  // Anything with a file extension is treated as static.
  if (/\.[^/]+$/.test(pathname)) return true
  return false
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url ?? "", key ?? "", {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Mirror the cookies on both the incoming request (so the rest of
        // this request lifecycle sees the refreshed values) and on the
        // response so the browser persists them.
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions)
        })
      },
    },
  })

  // getUser() validates the JWT and refreshes the session if needed. Do not
  // use getSession() for auth gating.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, searchParams } = request.nextUrl
  const publicRoute = isPublic(pathname)

  // If we are about to redirect to /sign-in for an unauthenticated user, the
  // page must still be reachable regardless of mode (sign-in, forgot, update).
  if (!user && !publicRoute) {
    const signin = request.nextUrl.clone()
    signin.pathname = "/sign-in"
    signin.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signin)
  }

  // Already signed in: bounce off the sign-in page (and any sub-mode query).
  if (user && pathname === "/sign-in") {
    const redirectTarget = searchParams.get("redirect") || "/"
    const target = request.nextUrl.clone()
    target.pathname = redirectTarget
    target.search = ""
    return NextResponse.redirect(target)
  }

  return response
}
