import { auth } from "@/auth";

const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export default auth((request) => {
  const { nextUrl } = request;
  const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`));

  if (!request.auth && !isPublicRoute && !nextUrl.pathname.startsWith("/api/auth")) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  if (request.auth && ["/login", "/register"].includes(nextUrl.pathname)) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
