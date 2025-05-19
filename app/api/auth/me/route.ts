import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "کاربر احراز هویت نشده است" }, { status: 401 })
    }

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}
