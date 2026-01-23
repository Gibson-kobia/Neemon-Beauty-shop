import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const launch = (process.env.NEXT_PUBLIC_LAUNCH_MODE ?? "true") === "true";

  if (pathname.startsWith("/preview-shop")) {
    const key = url.searchParams.get("key");
    if (key !== "NEEMONPREVIEW") {
      url.pathname = "/launch";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (launch) {
    url.pathname = "/launch";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/shop", "/category/:path*", "/offers", "/shade-quiz", "/preview-shop"],
};
