import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/blob/list",
    "/api/blob/cleanup",
    "/api/share",
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
