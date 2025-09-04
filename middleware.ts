import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(req: NextRequest) {
  return await updateSession(req)
}

// Optionally protect routes later by adding them to matcher
export const config = {
  matcher: [
    // Match all paths except static assets and images. Adjust as needed.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
