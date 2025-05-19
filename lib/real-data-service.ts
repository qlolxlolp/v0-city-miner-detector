import { db } from "./db"
import { detections, sensorData, detectionStats } from "./schema"
import { eq, desc, gte, lte } from "drizzle-orm"

// سرویس دریافت داده‌های واقعی از پایگاه داده
export class RealDataService {
  // دریافت آمار واقعی
  static async getRealTimeStats() {
    try {
      const stats = await db.select().from(detectionStats).limit(1)

      if (stats.length === 0) {
        throw new Error("آمار یافت نشد")
      }

      return stats[0]
    } catch (error) {
      console.error("خطا در دریافت آمار واقعی:", error)
      throw error
    }
  }

  // دریافت تشخیص‌های واقعی با فیلتر زمانی
  static async getRealTimeDetections(timeFilter: {
    startDate?: Date
    endDate?: Date
    method?: string
    status?: string
  }) {
    try {
      let query = db.select().from(detections).orderBy(desc(detections.timestamp))

      if (timeFilter.startDate) {
        query = query.where(gte(detections.timestamp, timeFilter.startDate))
      }

      if (timeFilter.endDate) {
        query = query.where(lte(detections.timestamp, timeFilter.endDate))
      }

      if (timeFilter.method) {
        query = query.where(eq(detections.method, timeFilter.method))
      }

      if (timeFilter.status) {
        query = query.where(eq(detections.status, timeFilter.status))
      }

      return await query
    } catch (error) {
      console.error("خطا در دریافت تشخیص‌های واقعی:", error)
      throw error
    }
  }

  // دریافت داده‌های سنسور واقعی
  static async getRealTimeSensorData(detectionId: string, dataType?: string) {
    try {
      let query = db.select().from(sensorData).where(eq(sensorData.detectionId, detectionId))

      if (dataType) {
        query = query.where(eq(sensorData.dataType, dataType))
      }

      return await query.orderBy(sensorData.timestamp)
    } catch (error) {
      console.error("خطا در دریافت داده‌های سنسور واقعی:", error)
      throw error
    }
  }

  // دریافت داده‌های تحلیلی واقعی
  static async getRealTimeAnalytics(timeFilter: {
    startDate?: Date
    endDate?: Date
  }) {
    try {
      // دریافت تشخیص‌ها در بازه زمانی
      const detectionData = await this.getRealTimeDetections(timeFilter)

      // تبدیل داده‌ها به فرمت مناسب برای نمودارها
      const trends = this.processDetectionTrends(detectionData)
      const methodComparison = this.processMethodComparison(detectionData)
      const successRate = this.processSuccessRate(detectionData)
      const confidenceDistribution = this.processConfidenceDistribution(detectionData)
      const heatmap = this.processHeatmapData(detectionData)
      const geographical = this.processGeographicalData(detectionData)

      return {
        trends,
        methodComparison,
        successRate,
        confidenceDistribution,
        heatmap,
        geographical,
      }
    } catch (error) {
      console.error("خطا در دریافت داده‌های تحلیلی واقعی:", error)
      throw error
    }
  }

  // پردازش داده‌های روند تشخیص
  private static processDetectionTrends(detections: any[]) {
    // گروه‌بندی تشخیص‌ها بر اساس تاریخ
    const groupedByDate = detections.reduce((acc, detection) => {
      const date = new Date(detection.timestamp)
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          detections: 0,
          confirmed: 0,
        }
      }

      acc[dateStr].detections++

      if (detection.status === "تایید شده") {
        acc[dateStr].confirmed++
      }

      return acc
    }, {})

    // تبدیل به آرایه و مرتب‌سازی بر اساس تاریخ
    return Object.values(groupedByDate).sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }

  // پردازش داده‌های مقایسه روش‌ها
  private static processMethodComparison(detections: any[]) {
    const methods = ["مصرف برق", "نویز صوتی", "سیگنال RF", "ترافیک شبکه"]
    const result: any[] = []

    // محاسبه تعداد تشخیص‌ها برای هر روش
    methods.forEach((method) => {
      const methodDetections = detections.filter((d) => d.method === method)
      const confirmedCount = methodDetections.filter((d) => d.status === "تایید شده").length
      const pendingCount = methodDetections.filter((d) => d.status === "در حال بررسی").length
      const rejectedCount = methodDetections.filter((d) => d.status === "رد شده").length

      result.push({
        name: method,
        total: methodDetections.length,
        confirmed: confirmedCount,
        pending: pendingCount,
        rejected: rejectedCount,
      })
    })

    return result
  }

  // پردازش داده‌های نرخ موفقیت
  private static processSuccessRate(detections: any[]) {
    const methods = ["مصرف برق", "نویز صوتی", "سیگنال RF", "ترافیک شبکه"]
    const result: any[] = []

    // محاسبه نرخ موفقیت برای هر روش
    methods.forEach((method, index) => {
      const methodDetections = detections.filter((d) => d.method === method)
      const totalCount = methodDetections.length

      if (totalCount === 0) {
        result.push({
          name: method,
          value: 0,
          color: this.getMethodColor(index),
        })
        return
      }

      const confirmedCount = methodDetections.filter((d) => d.status === "تایید شده").length
      const successRate = Math.round((confirmedCount / totalCount) * 100)

      result.push({
        name: method,
        value: successRate,
        color: this.getMethodColor(index),
      })
    })

    return result
  }

  // پردازش داده‌های توزیع اطمینان
  private static processConfidenceDistribution(detections: any[]) {
    const ranges = [
      { name: "0-20%", min: 0, max: 0.2 },
      { name: "21-40%", min: 0.21, max: 0.4 },
      { name: "41-60%", min: 0.41, max: 0.6 },
      { name: "61-80%", min: 0.61, max: 0.8 },
      { name: "81-100%", min: 0.81, max: 1 },
    ]

    const result = ranges.map((range) => {
      const count = detections.filter((d) => d.confidence >= range.min && d.confidence <= range.max).length

      return {
        name: range.name,
        value: count,
      }
    })

    return result
  }

  // پردازش داده‌های نقشه حرارتی
  private static processHeatmapData(detections: any[]) {
    const result = []

    // ایجاد ماتریس 7x24 برای روزهای هفته و ساعات روز
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // شمارش تشخیص‌ها در این روز و ساعت
        const count = detections.filter((d) => {
          const date = new Date(d.timestamp)
          return date.getDay() === day && date.getHours() === hour
        }).length

        result.push({
          day,
          hour,
          value: count,
        })
      }
    }

    return result
  }

  // پردازش داده‌های توزیع جغرافیایی
  private static processGeographicalData(detections: any[]) {
    // گروه‌بندی تشخیص‌ها بر اساس موقعیت
    const groupedByLocation = detections.reduce((acc: any, detection: any) => {
      const location = detection.location

      if (!acc[location]) {
        acc[location] = {
          id: Object.keys(acc).length + 1,
          city: location,
          lat: detection.lat,
          lng: detection.lng,
          count: 0,
        }
      }

      acc[location].count++

      return acc
    }, {})

    return Object.values(groupedByLocation)
  }

  // دریافت رنگ برای هر روش
  private static getMethodColor(index: number) {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"]
    return colors[index % colors.length]
  }

  // دریافت وضعیت اتصال سخت‌افزارها
  static async getHardwareConnectionStatus() {
    try {
      // در یک محیط واقعی، این تابع باید به API سیستم متصل شود
      // و وضعیت اتصال سخت‌افزارها را دریافت کند

      // برای نمونه، ما یک درخواست به API داخلی ارسال می‌کنیم
      const response = await fetch("/api/hardware/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("خطا در دریافت وضعیت سخت‌افزارها")
      }

      return await response.json()
    } catch (error) {
      console.error("خطا در دریافت وضعیت اتصال سخت‌افزارها:", error)
      throw error
    }
  }
}
