import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const PUBLIC_EXACT = ["/sign-in"]

const PUBLIC_PREFIXES = [
  "/_next",
  "/auth/callback",
  "/favicon.ico",
]

function isPublic(pathname: string) {
  if (PUBLIC_EXACT.includes(pathname)) return true
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true
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
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = NextResponse.next({ request })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, searchParams } = request.nextUrl

  if (!user && !isPublic(pathname)) {
    const signin = request.nextUrl.clone()

    signin.pathname = "/sign-in"
    signin.searchParams.set("redirect", pathname)

    return NextResponse.redirect(signin)
  }

  if (user && pathname === "/sign-in") {
    const redirectTarget = searchParams.get("redirect") || "/"

    const target = request.nextUrl.clone()
    target.pathname = redirectTarget
    target.search = ""

    return NextResponse.redirect(target)
  }

  return response
}