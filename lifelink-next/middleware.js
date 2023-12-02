import { NextResponse } from "next/server";

import { laravelBaseUrl } from "./app/variables";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path.includes("/register") ||
    path.includes("/forgot") ||
    path.includes("/news") ||
    path.includes("/banks") ||
    path.includes("/about") ||
    path.includes("/contacts");
  const isAdminPath = path.includes("/admin");
  const token = request.cookies.get("token");

  const response = await fetch(`${laravelBaseUrl}/api/check-role`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token?.value || ""}`,
    },
  });

  let isAdmin;
  if (response.status === 200) {
    isAdmin = await response.json();
  }

  if (isPublicPath && token) {
    if (isAdmin?.isAdmin === 1) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  } else if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPath && token) {
    if (isAdmin?.isAdmin === 0) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  } else if (!isAdminPath && token) {
    if (isAdmin?.isAdmin === 1)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/news",
    "/banks",
    "/about",
    "/contacts",
    "/login",
    "/register",
    "/forgot",
    "/user/:path*",
    "/admin/:path*",
  ],
};
