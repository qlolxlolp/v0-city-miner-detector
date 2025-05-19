import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // دریافت تشخیص‌ها
    const { data: detections, error: detectionsError } = await supabase
      .from("detections")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100)

    if (detectionsError) {
      console.error("خطا در دریافت تشخیص‌ها:", detectionsError)
      return NextResponse.json({ error: detectionsError.message }, { status: 500 })
    }

    // دریافت آمار
    const { data: stats, error: statsError } = await supabase.from("detection_stats").select("*").single()

    if (statsError) {
      console.error("خطا در دریافت آمار:", statsError)
      return NextResponse.json({ error: statsError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        detections,
        stats,
      },
    })
  } catch (error) {
    console.error("خطا در سرور:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}
