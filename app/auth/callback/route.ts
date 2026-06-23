// app/auth/callback/route.ts
//
// This is the Supabase auth redirect target. It runs on the server so the
// @supabase/ssr code_verifier cookie (set when the recovery / OAuth flow was
// started) is available to exchangeCodeForSession. A client component cannot
// read that cookie, which is why a Route Handler is the correct place to
// finish the flow.
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
     const { searchParams, origin } = new URL(request.url)
     const code = searchParams.get("code")
     const errorDescription =
          searchParams.get("error_description") || searchParams.get("error")
     const nextParam = searchParams.get("next") || "/"

     // Only allow same-origin relative redirects to avoid open-redirect issues.
     function safeNext(raw: string) {
          if (!raw.startsWith("/") || raw.startsWith("//")) return "/"
          return raw
     }
     const next = safeNext(nextParam)

     if (errorDescription) {
          const url = new URL("/sign-in", request.url)
          url.searchParams.set("error", errorDescription)
          return NextResponse.redirect(url)
     }

     if (code) {
          const supabase = await createClient()
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (!error) {
               return NextResponse.redirect(new URL(next, request.url))
          }
          const url = new URL("/sign-in", request.url)
          url.searchParams.set("error", error.message)
          return NextResponse.redirect(url)
     }

     // No code: this is the implicit / hash-based recovery flow. The user
     // already has a session after clicking the email link; just send them on.
     return NextResponse.redirect(new URL(next, origin))
}
