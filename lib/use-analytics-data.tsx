"use client"
import { useEffect, useState } from "react"
import { supabaseClient } from "./supabase/client"
// Define the types for our analytics data
interface TimeSeriesDataPoint {
  date: string
  "مصرف برق": number
  "نویز صوتی": number
  "سیگنال RF": number
  "ترافیک شبکه": number
  کل: number
}
interface HeatmapDataPoint {
  hour: number
  dayIndex: number
  day: string
  value: number
}
interface MethodComparisonDataPoint {
  name: string
  "مصرف برق": number
  "نویز صوتی": number
  "سیگنال RF": number
  "ترافیک شبکه": number
}
interface MethodSuccessRateDataPoint {
  name: string
  "نرخ موفقیت": number
  "نرخ خطا": number
}
interface ConfidenceDistributionDataPoint {
  name: string
  value: number
}
interface GeographicalDataPoint {
  name: string
  lat: number
  lng: number
  count: number
}
interface SuccessRateDataPoint {
  date: string
  "نرخ موفقیت": number
  "نرخ خطا": number
  "مصرف برق": number
  "نویز صوتی": number
  "سیگنال RF": number
  "ترافیک شبکه": number
}
// Hook to provide analytics data from real database
export function useAnalyticsData() {
  // Time series data for detection trends
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[]>([])
  // Heatmap data for detection distribution by time/day
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([])
  // Method comparison data
  const [methodComparisonData, setMethodComparisonData] = useState<MethodComparisonDataPoint[]>([])
  // Method success rate data
  const [methodSuccessRateData, setMethodSuccessRateData] = useState<MethodSuccessRateDataPoint[]>([])
  // Confidence distribution data
  const [confidenceDistributionData, setConfidenceDistributionData] = useState<ConfidenceDistributionDataPoint[]>([])
  // Geographical distribution data
  const [geographicalData, setGeographicalData] = useState<GeographicalDataPoint[]>([])
  // Success rate analysis data
  const [successRateData, setSuccessRateData] = useState<SuccessRateDataPoint[]>([])
  // Loading state
  const [loading, setLoading] = useState(true)
  // Error state
  const [error, setError] = useState<string | null>(null)
  // Fetch real data from database
  useEffect(() => {
    const controller = new AbortController()
    async function fetchRealData() {
      try {
        setLoading(true)
        // بررسی احراز هویت کاربر
        const { data: session } = await supabaseClient.auth.getSession()
        if (!session?.session) {
          setError("لطفا برای دسترسی به داده‌های تحلیلی وارد سیستم شوید")
          setLoading(false)
          return
        }
        // بررسی اتصال به پایگاه داده
        const { error: connectionError } = await supabaseClient.from("health_check").select("*").limit(1)
        if (connectionError && connectionError.code === "PGRST301") {
          setError("خطا در اتصال به پایگاه داده. لطفا اتصال اینترنت خود را بررسی کنید")
          setLoading(false)
          return
        }
        // Fetch time series data - real detections grouped by date and method
        const { data: timeSeriesRawData, error: timeSeriesError } = await supabaseClient
          .from("detections")
          .select("timestamp, method")
          .order("timestamp", { ascending: true })
          .abortSignal(controller.signal) // امکان لغو درخواست
        if (timeSeriesError) {
          console.error("خطای دریافت داده‌های سری زمانی:", timeSeriesError)
          throw new Error(`خطا در دریافت داده‌های سری زمانی: ${timeSeriesError.message}`)
        }
        // Process time series data
        const timeSeriesMap = new Map<
          string,
          { "مصرف برق": number; "نویز صوتی": number; "سیگنال RF": number; "ترافیک شبکه": number; کل: number }
        >()
        timeSeriesRawData.forEach((detection) => {
          const date = new Date(detection.timestamp)
          const dateKey = `${date.getMonth() + 1}/${date.getDate()}`
          if (!timeSeriesMap.has(dateKey)) {
            timeSeriesMap.set(dateKey, {
              "مصرف برق": 0,
              "نویز صوتی": 0,
              "سیگنال RF": 0,
              "ترافیک شبکه": 0,
              کل: 0,
            })
          }
          const current = timeSeriesMap.get(dateKey)!
          switch (detection.method) {
            case "مصرف برق":
              current["مصرف برق"]++
              break
            case "نویز صوتی":
              current["نویز صوتی"]++
              break
            case "سیگنال RF":
              current["سیگنال RF"]++
              break
            case "ترافیک شبکه":
              current["ترافیک شبکه"]++
              break
          }
          current.کل++
          timeSeriesMap.set(dateKey, current)
        })
        const processedTimeSeriesData: TimeSeriesDataPoint[] = Array.from(timeSeriesMap.entries())
          .map(([date, counts]) => ({
            date,
            ...counts,
          }))
          .sort((a, b) => {
            const [aMonth, aDay] = a.date.split("/").map(Number)
            const [bMonth, bDay] = b.date.split("/").map(Number)
            return aMonth === bMonth ? aDay - bDay : aMonth - bMonth
          })
        setTimeSeriesData(processedTimeSeriesData)
        // Fetch heatmap data - detections grouped by hour and day of week
        const { data: heatmapRawData, error: heatmapError } = await supabaseClient
          .from("detections")
          .select("timestamp")
        if (heatmapError) throw new Error(`Error fetching heatmap data: ${heatmapError.message}`)
        // Process heatmap data
        const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]
        const heatmapCounts = Array(7)
          .fill(0)
          .map(() => Array(24).fill(0))
        heatmapRawData.forEach((detection) => {
          const date = new Date(detection.timestamp)
          // Convert to Persian calendar day of week (Saturday is 0)
          let dayIndex = date.getDay() - 6
          if (dayIndex < 0) dayIndex += 7
          const hour = date.getHours()
          heatmapCounts[dayIndex][hour]++
        })
        const processedHeatmapData: HeatmapDataPoint[] = []
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          for (let hour = 0; hour < 24; hour++) {
            processedHeatmapData.push({
              hour,
              dayIndex,
              day: days[dayIndex],
              value: heatmapCounts[dayIndex][hour],
            })
          }
        }
        setHeatmapData(processedHeatmapData)
        // Fetch method comparison data - detections grouped by month and method
        const { data: methodComparisonRawData, error: methodComparisonError } = await supabaseClient
          .from("detections")
          .select("timestamp, method")
        if (methodComparisonError)
          throw new Error(`Error fetching method comparison data: ${methodComparisonError.message}`)
        // Process method comparison data
        const months = [
          "فروردین",
          "اردیبهشت",
          "خرداد",
          "تیر",
          "مرداد",
          "شهریور",
          "مهر",
          "آبان",
          "آذر",
          "دی",
          "بهمن",
          "اسفند",
        ]
        const methodComparisonCounts = new Map<
          string,
          { "مصرف برق": number; "نویز صوتی": number; "سیگنال RF": number; "ترافیک شبکه": number }
        >()
        months.forEach((month) => {
          methodComparisonCounts.set(month, {
            "مصرف برق": 0,
            "نویز صوتی": 0,
            "سیگنال RF": 0,
            "ترافیک شبکه": 0,
          })
        })
        methodComparisonRawData.forEach((detection) => {
          const date = new Date(detection.timestamp)
          const month = months[date.getMonth()]
          const current = methodComparisonCounts.get(month)!
          switch (detection.method) {
            case "مصرف برق":
              current["مصرف برق"]++
              break
            case "نویز صوتی":
              current["نویز صوتی"]++
              break
            case "سیگنال RF":
              current["سیگنال RF"]++
              break
            case "ترافیک شبکه":
              current["ترافیک شبکه"]++
              break
          }
          methodComparisonCounts.set(month, current)
        })
        const processedMethodComparisonData: MethodComparisonDataPoint[] = Array.from(
          methodComparisonCounts.entries(),
        ).map(([name, counts]) => ({
          name,
          ...counts,
        }))
        setMethodComparisonData(processedMethodComparisonData)
        // Fetch method success rate data - detections grouped by method and status
        const { data: methodSuccessRawData, error: methodSuccessError } = await supabaseClient
          .from("detections")
          .select("method, status")
        if (methodSuccessError)
          throw new Error(`Error fetching method success rate data: ${methodSuccessError.message}`)
        // Process method success rate data
        const methodSuccessCounts = new Map<string, { success: number; error: number; total: number }>()
        methodSuccessRawData.forEach((detection) => {
          if (!methodSuccessCounts.has(detection.method)) {
            methodSuccessCounts.set(detection.method, { success: 0, error: 0, total: 0 })
          }
          const current = methodSuccessCounts.get(detection.method)!
          current.total++
          if (detection.status === "تایید شده") {
            current.success++
          } else if (detection.status === "رد شده") {
            current.error++
          }
          methodSuccessCounts.set(detection.method, current)
        })
        const processedMethodSuccessRateData: MethodSuccessRateDataPoint[] = Array.from(
          methodSuccessCounts.entries(),
        ).map(([name, counts]) => ({
          name,
          "نرخ موفقیت": counts.total > 0 ? Math.round((counts.success / counts.total) * 100) : 0,
          "نرخ خطا": counts.total > 0 ? Math.round((counts.error / counts.total) * 100) : 0,
        }))
        setMethodSuccessRateData(processedMethodSuccessRateData)
        // Fetch confidence distribution data
        const { data: confidenceRawData, error: confidenceError } = await supabaseClient
          .from("detections")
          .select("confidence")
        if (confidenceError) throw new Error(`Error fetching confidence distribution data: ${confidenceError.message}`)
        // Process confidence distribution data
        const confidenceCounts = {
          "بالا (۹۰-۱۰۰٪)": 0,
          "متوسط (۷۵-۹۰٪)": 0,
          "پایین (۶۰-۷۵٪)": 0,
          "ضعیف (زیر ۶۰٪)": 0,
        }
        confidenceRawData.forEach((detection) => {
          const confidence = detection.confidence * 100
          if (confidence >= 90) {
            confidenceCounts["بالا (۹۰-۱۰۰٪)"]++
          } else if (confidence >= 75) {
            confidenceCounts["متوسط (۷۵-۹۰٪)"]++
          } else if (confidence >= 60) {
            confidenceCounts["پایین (۶۰-۷۵٪)"]++
          } else {
            confidenceCounts["ضعیف (زیر ۶۰٪)"]++
          }
        })
        const processedConfidenceDistributionData: ConfidenceDistributionDataPoint[] = Object.entries(
          confidenceCounts,
        ).map(([name, value]) => ({ name, value }))
        setConfidenceDistributionData(processedConfidenceDistributionData)
        // Fetch geographical distribution data
        const { data: geoRawData, error: geoError } = await supabaseClient
          .from("detections")
          .select("location, lat, lng")
        if (geoError) throw new Error(`Error fetching geographical distribution data: ${geoError.message}`)
        // Process geographical distribution data
        const geoCounts = new Map<string, { lat: number; lng: number; count: number }>()
        geoRawData.forEach((detection) => {
          // Extract city name from location (assuming format like "تهران - منطقه 5")
          const cityMatch = detection.location.match(/^([^-]+)/)
          const city = cityMatch ? cityMatch[1].trim() : detection.location
          if (!geoCounts.has(city)) {
            geoCounts.set(city, {
              lat: detection.lat,
              lng: detection.lng,
              count: 0,
            })
          }
          const current = geoCounts.get(city)!
          current.count++
          geoCounts.set(city, current)
        })
        const processedGeographicalData: GeographicalDataPoint[] = Array.from(geoCounts.entries()).map(
          ([name, data]) => ({
            name,
            lat: data.lat,
            lng: data.lng,
            count: data.count,
          }),
        )
        setGeographicalData(processedGeographicalData)
        // Fetch success rate analysis data - detections grouped by month and status/method
        const { data: successRateRawData, error: successRateError } = await supabaseClient
          .from("detections")
          .select("timestamp, method, status")
          .order("timestamp", { ascending: true })
        if (successRateError) throw new Error(`Error fetching success rate data: ${successRateError.message}`)
        // Process success rate data
        const successRateMap = new Map<
          string,
          {
            total: number
            success: number
            error: number
            methods: {
              "مصرف برق": { total: number; success: number }
              "نویز صوتی": { total: number; success: number }
              "سیگنال RF": { total: number; success: number }
              "ترافیک شبکه": { total: number; success: number }
            }
          }
        >()
        successRateRawData.forEach((detection) => {
          const date = new Date(detection.timestamp)
          const monthKey = `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`
          if (!successRateMap.has(monthKey)) {
            successRateMap.set(monthKey, {
              total: 0,
              success: 0,
              error: 0,
              methods: {
                "مصرف برق": { total: 0, success: 0 },
                "نویز صوتی": { total: 0, success: 0 },
                "سیگنال RF": { total: 0, success: 0 },
                "ترافیک شبکه": { total: 0, success: 0 },
              },
            })
          }
          const current = successRateMap.get(monthKey)!
          current.total++
          if (detection.status === "تایید شده") {
            current.success++
            current.methods[detection.method].success++
          } else if (detection.status === "رد شده") {
            current.error++
          }
          current.methods[detection.method].total++
          successRateMap.set(monthKey, current)
        })
        const processedSuccessRateData: SuccessRateDataPoint[] = Array.from(successRateMap.entries())
          .map(([date, data]) => ({
            date,
            "نرخ موفقیت": data.total > 0 ? Math.round((data.success / data.total) * 100) : 0,
            "نرخ خطا": data.total > 0 ? Math.round((data.error / data.total) * 100) : 0,
            "مصرف برق":
              data.methods["مصرف برق"].total > 0
                ? Math.round((data.methods["مصرف برق"].success / data.methods["مصرف برق"].total) * 100)
                : 0,
            "نویز صوتی":
              data.methods["نویز صوتی"].total > 0
                ? Math.round((data.methods["نویز صوتی"].success / data.methods["نویز صوتی"].total) * 100)
                : 0,
            "سیگنال RF":
              data.methods["سیگنال RF"].total > 0
                ? Math.round((data.methods["سیگنال RF"].success / data.methods["سیگنال RF"].total) * 100)
                : 0,
            "ترافیک شبکه":
              data.methods["ترافیک شبکه"].total > 0
                ? Math.round((data.methods["ترافیک شبکه"].success / data.methods["ترافیک شبکه"].total) * 100)
                : 0,
          }))
          .sort((a, b) => {
            const [aMonth, aYear] = a.date.split("/").map(Number)
            const [bMonth, bYear] = b.date.split("/").map(Number)
            return aYear === bYear ? aMonth - bMonth : aYear - bYear
          })
        setSuccessRateData(processedSuccessRateData)

        // Add caching mechanism
        try {
          localStorage.setItem(
            "analytics_cache",
            JSON.stringify({
              timeSeriesData: processedTimeSeriesData,
              heatmapData: processedHeatmapData,
              methodComparisonData: processedMethodComparisonData,
              methodSuccessRateData: processedMethodSuccessRateData,
              confidenceDistributionData: processedConfidenceDistributionData,
              geographicalData: processedGeographicalData,
              successRateData: processedSuccessRateData,
              timestamp: Date.now(),
            }),
          )
        } catch (cacheError) {
          console.warn("Failed to cache analytics data:", cacheError)
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        // Try to load from cache if available
        try {
          const cachedData = localStorage.getItem("analytics_cache")
          if (cachedData) {
            const parsed = JSON.parse(cachedData)
            const cacheAge = Date.now() - parsed.timestamp
            // Use cache if it's less than 1 hour old
            if (cacheAge < 3600000) {
              setTimeSeriesData(parsed.timeSeriesData)
              setHeatmapData(parsed.heatmapData)
              setMethodComparisonData(parsed.methodComparisonData)
              setMethodSuccessRateData(parsed.methodSuccessRateData)
              setConfidenceDistributionData(parsed.confidenceDistributionData)
              setGeographicalData(parsed.geographicalData)
              setSuccessRateData(parsed.successRateData)
              setError(
                "داده‌ها از حافظه نهان بارگذاری شدند. آخرین بروزرسانی: " +
                  new Date(parsed.timestamp).toLocaleTimeString("fa-IR"),
              )
              setLoading(false)
              return
            }
          }
        } catch (cacheError) {
          console.warn("Failed to load cached data:", cacheError)
        }
        setError(err instanceof Error ? err.message : "خطا در دریافت داده‌های تحلیلی")
      } finally {
        setLoading(false)
      }
    }

    fetchRealData()
    return () => {
      controller.abort()
    }
  }, [])

  return {
    timeSeriesData,
    heatmapData,
    methodComparisonData,
    methodSuccessRateData,
    confidenceDistributionData,
    geographicalData,
    successRateData,
    loading,
    error,
  }
}
