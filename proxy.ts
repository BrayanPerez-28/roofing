import { NextRequest, NextResponse } from "next/server";

/**
 * proxy.ts — Next.js 16 route guard (renamed from middleware.ts).
 *
 * Auth tokens live in localStorage (client-side only), so server-side
 * enforcement is limited. The real guard is in (admin)/admin/layout.tsx.
 * This proxy just passes all requests through — the client layout will
 * redirect unauthenticated users to /login.
 */
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
