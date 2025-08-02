import { NextRequest, NextResponse } from "next/server";

const privateAdminPaths = ["/admin"];
const authPaths = ["/login"];
const sellerRegisterPaths = ["/seller/register"];
const privateSellerPaths = ["/seller"];

export function middleware(request: NextRequest) {
 
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("authToken")?.value;
  const roles = request.cookies.get("roles")?.value;

  // No token: Redirect private paths to login
  if (!sessionToken) {
    if (privateAdminPaths.some((path) => pathname.startsWith(path)) ||
        privateSellerPaths.some((path) => pathname.startsWith(path)) ||
        sellerRegisterPaths.some((path) => pathname.startsWith(path))) {
      if (pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    return NextResponse.next();
  }

  // Logged in: Block auth paths
  if (authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url)); // Or role-based home
  }

  if (!roles) {
    return NextResponse.redirect(new URL("/login", request.url)); // Force relogin
  }

  // Force SELLER to /seller if not in seller paths
  if (roles === "SELLER" && !privateSellerPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/seller", request.url));
  }

  // Block SELLER from /seller/register
  if (sellerRegisterPaths.some((path) => pathname.startsWith(path)) && roles === "SELLER") {
    return NextResponse.redirect(new URL("/seller", request.url)); // Change to /seller instead of dashboard for simplicity
  }

  // Private seller paths: Must be SELLER
  if (privateSellerPaths.some((path) => pathname.startsWith(path))) {
    if (roles !== "SELLER") {
      const redirectPath = roles === "USER" ? "/seller/register" : "/";
      if (pathname !== redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
  }

  // Private admin paths: Must be ADMIN
  if (privateAdminPaths.some((path) => pathname.startsWith(path))) {
    if (roles !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"], // Loại trừ các route tĩnh
};