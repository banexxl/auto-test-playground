// app/api/auth/sign-out/route.ts
// Signs the current user out via Supabase. The browser Supabase client also
// handles sign-out, so this route is mainly a convenience for full-page
// navigations and for clearing cookies on the server.
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function POST() {
  await signOut()
  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  await signOut()
  const redirectTo = req.nextUrl.searchParams.get("redirect") || "/sign-in"
  return NextResponse.redirect(new URL(redirectTo, req.url))
}
