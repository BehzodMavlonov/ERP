import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    const homeUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(homeUrl);
  }
});

export const config = {
  matcher: ["/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico).*)"],
};
