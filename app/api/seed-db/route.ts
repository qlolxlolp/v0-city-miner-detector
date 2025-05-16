import { NextResponse } from "next/server"

// این API دیگر داده‌های نمایشی تولید نمی‌کند
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "این عملکرد غیرفعال شده است. سیستم فقط از داده‌های واقعی استفاده می‌کند.",
    },
    { status: 400 },
  )
}
