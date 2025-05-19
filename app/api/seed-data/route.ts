import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { detections, sensorData, detectionStats } from "@/lib/schema"

export async function GET() {
  try {
    // ایجاد داده‌های نمونه برای تشخیص‌ها
    const detectionsData = [
      {
        location: "تهران - منطقه 5",
        method: "مصرف برق",
        status: "تایید شده",
        lat: 35.6892,
        lng: 51.389,
        confidence: 0.85,
        sensorId: "SENSOR-001",
        estimatedPower: "2500W",
        estimatedDevices: "5-7",
      },
      {
        location: "اصفهان - خیابان چهارباغ",
        method: "نویز صوتی",
        status: "در حال بررسی",
        lat: 32.6539,
        lng: 51.666,
        confidence: 0.72,
        sensorId: "SENSOR-002",
        estimatedPower: "1800W",
        estimatedDevices: "3-5",
      },
      {
        location: "مشهد - بلوار وکیل آباد",
        method: "سیگنال RF",
        status: "تایید شده",
        lat: 36.2972,
        lng: 59.6067,
        confidence: 0.91,
        sensorId: "SENSOR-003",
        estimatedPower: "3200W",
        estimatedDevices: "8-10",
      },
      {
        location: "شیراز - خیابان زند",
        method: "ترافیک شبکه",
        status: "رد شده",
        lat: 29.6104,
        lng: 52.5288,
        confidence: 0.65,
        sensorId: "SENSOR-004",
        estimatedPower: "1200W",
        estimatedDevices: "2-3",
      },
      {
        location: "تبریز - خیابان ولیعصر",
        method: "مصرف برق",
        status: "تایید شده",
        lat: 38.0753,
        lng: 46.2919,
        confidence: 0.88,
        sensorId: "SENSOR-005",
        estimatedPower: "2800W",
        estimatedDevices: "6-8",
      },
    ]

    // درج داده‌های تشخیص
    const insertedDetections = await db.insert(detections).values(detectionsData).returning()

    // ایجاد داده‌های سنسور برای هر تشخیص
    const sensorDataValues = []

    for (const detection of insertedDetections) {
      const dataTypes = {
        "مصرف برق": "power",
        "نویز صوتی": "noise",
        "سیگنال RF": "rf",
        "ترافیک شبکه": "network",
      }

      const dataType = dataTypes[detection.method as keyof typeof dataTypes]

      // ایجاد 5 نقطه داده برای هر تشخیص
      for (let i = 0; i < 5; i++) {
        const timestamp = new Date(detection.timestamp)
        timestamp.setMinutes(timestamp.getMinutes() + i * 10)

        let value = 0
        let unit = ""

        switch (dataType) {
          case "power":
            value = 2000 + Math.random() * 1000
            unit = "وات"
            break
          case "noise":
            value = 60 + Math.random() * 20
            unit = "دسیبل"
            break
          case "rf":
            value = 70 + Math.random() * 25
            unit = "dBm"
            break
          case "network":
            value = 500 + Math.random() * 300
            unit = "Mbps"
            break
        }

        sensorDataValues.push({
          detectionId: detection.id,
          dataType,
          timestamp,
          value,
          unit,
          notes: "داده اولیه سنسور",
        })
      }
    }

    // درج داده‌های سنسور
    await db.insert(sensorData).values(sensorDataValues)

    // به‌روزرسانی آمار
    await db.update(detectionStats).set({
      totalCount: insertedDetections.length,
      powerUsageCount: insertedDetections.filter((d) => d.method === "مصرف برق").length,
      noiseCount: insertedDetections.filter((d) => d.method === "نویز صوتی").length,
      rfCount: insertedDetections.filter((d) => d.method === "سیگنال RF").length,
      networkCount: insertedDetections.filter((d) => d.method === "ترافیک شبکه").length,
      confirmedCount: insertedDetections.filter((d) => d.status === "تایید شده").length,
      pendingCount: insertedDetections.filter((d) => d.status === "در حال بررسی").length,
      rejectedCount: insertedDetections.filter((d) => d.status === "رد شده").length,
      lastWeekTotal: insertedDetections.length,
      lastWeekPowerUsage: insertedDetections.filter((d) => d.method === "مصرف برق").length,
      lastWeekNoise: insertedDetections.filter((d) => d.method === "نویز صوتی").length,
      lastWeekRf: insertedDetections.filter((d) => d.method === "سیگنال RF").length,
      lastWeekNetwork: insertedDetections.filter((d) => d.method === "ترافیک شبکه").length,
      lastUpdated: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "داده‌های نمونه با موفقیت ایجاد شدند",
      detections: insertedDetections.length,
      sensorData: sensorDataValues.length,
    })
  } catch (error) {
    console.error("Error seeding data:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
