import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("Sem token, redirecionando para /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }


}

export const config = {
  matcher: ["/homepage", "/homepage/:path*", "/dashboard/:path*"],
  runtime: "nodejs",
}