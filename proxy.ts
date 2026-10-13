import { NextResponse, type NextRequest } from "next/server";
import { caseStudies } from "@/content/work";

const slugs = new Set(caseStudies.map((c) => c.slug));

/**
 * - Unknown /work/<slug> URLs get a real 404 (instead of a 200 that is then cached).
 * - Paths left over from the domain's previous owners return 410 Gone so search engines drop them.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/feed" || pathname.startsWith("/feed/") || pathname === "/public" || pathname.startsWith("/public/")) {
    return new NextResponse("Gone", { status: 410, headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  const m = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (m && !slugs.has(decodeURIComponent(m[1]))) {
    // Rewrite to a path that doesn't exist so Next renders the 404 page with a 404 status.
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/work/:slug", "/feed", "/feed/:path*", "/public", "/public/:path*"],
};
