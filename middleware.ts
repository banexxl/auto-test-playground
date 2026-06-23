import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Runs for every request that is not a static asset. The helper refreshes the
// Supabase auth cookies and redirects unauthenticated users to /sign-in.
export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, js, css, and other static assets (anything with a file extension)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)",
  ],
}
