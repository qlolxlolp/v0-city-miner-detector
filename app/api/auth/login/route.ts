import { NextResponse } from "next/server"
import { authenticateUser, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "ایمیل و رمز عبور الزامی هستند" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 })
    }

    const token = await createToken(user)
    setAuthCookie(token)

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    console.error("Error in login:", error)
    return NextResponse.json({ error: "خطای سرور در ورود" }, { status: 500 })
  }
}
