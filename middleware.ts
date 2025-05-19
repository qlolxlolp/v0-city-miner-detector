import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // مسیرهایی که نیاز به احراز هویت ندارند
  const publicPaths = ["/login", "/api/auth/login", "/api/auth/signup", "/api/migrate"]
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith("/api/auth/"),
  )

  // اگر مسیر عمومی است، اجازه دسترسی بدهیم
  if (isPublicPath) {
    return NextResponse.next()
  }

  // بررسی وجود توکن در کوکی
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // تأیید توکن
  const payload = await verifyToken(token)

  if (!payload) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// تعیین مسیرهایی که میدلور باید روی آنها اعمال شود
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
