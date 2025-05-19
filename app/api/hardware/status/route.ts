import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hardwareDevices } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // دریافت لیست دستگاه‌های سخت‌افزاری از پایگاه داده
    const devices = await db.select().from(hardwareDevices)

    // بررسی وضعیت اتصال هر دستگاه
    const devicesWithStatus = await Promise.all(
      devices.map(async (device) => {
        // در یک محیط واقعی، این بخش باید با سیستم عامل ارتباط برقرار کند
        // و وضعیت واقعی دستگاه را بررسی کند

        // برای مثال، می‌توان از یک سرویس سیستمی استفاده کرد
        // یا با پورت‌های سریال ارتباط برقرار کرد

        // در اینجا، ما فرض می‌کنیم که دستگاه‌ها به صورت تصادفی متصل یا قطع هستند
        // اما در محیط واقعی، این باید با بررسی واقعی جایگزین شود

        const isConnected = device.lastSeen
          ? new Date().getTime() - new Date(device.lastSeen).getTime() < 300000 // 5 دقیقه
          : false

        return {
          ...device,
          isConnected,
          connectionStatus: isConnected ? "متصل" : "قطع",
          lastChecked: new Date().toISOString(),
        }
      }),
    )

    // به‌روزرسانی وضعیت دستگاه‌ها در پایگاه داده
    for (const device of devicesWithStatus) {
      await db
        .update(hardwareDevices)
        .set({
          isConnected: device.isConnected,
          lastChecked: device.lastChecked,
        })
        .where(eq(hardwareDevices.id, device.id))
    }

    return NextResponse.json({
      success: true,
      devices: devicesWithStatus,
    })
  } catch (error) {
    console.error("خطا در بررسی وضعیت سخت‌افزارها:", error)
    return NextResponse.json({ success: false, message: "خطا در بررسی وضعیت سخت‌افزارها" }, { status: 500 })
  }
}
