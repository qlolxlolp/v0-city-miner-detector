import { NextResponse } from "next/server"
import { updateDetectionStats } from "@/lib/data-access"

export async function GET() {
  try {
    const stats = await updateDetectionStats()

    if (!stats) {
      return NextResponse.json({ error: "خطا در به‌روزرسانی آمار" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "آمار با موفقیت به‌روزرسانی شد",
      stats,
    })
  } catch (error) {
    console.error("خطا در سرور:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}
