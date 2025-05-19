"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Radio, Volume2, Wifi, AlertCircle, RefreshCw } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-provider"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

export function DetectionStats() {
  const { stats, refreshData } = useWebSocket()
  const [highlightedStats, setHighlightedStats] = useState<Record<string, boolean>>({
    total: false,
    powerUsage: false,
    noise: false,
    rf: false,
    network: false,
  })
  // آمار قبلی برای مقایسه
  const [prevStats, setPrevStats] = useState(stats)
  // افزودن حالت خطا
  const [error, setError] = useState<string | null>(null)
  // افزودن حالت بارگذاری
  const [loading, setLoading] = useState(false)
  // افزودن حالت به‌روزرسانی
  const [isUpdating, setIsUpdating] = useState(false)

  // دریافت تغییرات هفتگی
  const [weeklyChanges, setWeeklyChanges] = useState({
    total: 0,
    powerUsage: 0,
    noise: 0,
    rf: 0,
    network: 0,
  })

  // دریافت آمار هفتگی از پایگاه داده
  useEffect(() => {
    async function fetchWeeklyChanges() {
      try {
        const { data, error } = await supabaseClient.from("detection_stats").select("*").single()

        if (error) {
          console.error("خطا در دریافت آمار هفتگی:", error)
          return
        }

        if (data) {
          setWeeklyChanges({
            total: data.last_week_total,
            powerUsage: data.last_week_power_usage,
            noise: data.last_week_noise,
            rf: data.last_week_rf,
            network: data.last_week_network,
          })
        }
      } catch (err) {
        console.error("خطا در ارتباط با سرور:", err)
      }
    }

    fetchWeeklyChanges()
  }, [])

  // افکت برای برجسته کردن آمار تغییر یافته
  useEffect(() => {
    // در بارگذاری اول برجسته نکن
    if (loading) return
    const newHighlights: Record<string, boolean> = {
      total: stats.total !== prevStats.total,
      powerUsage: stats.powerUsage !== prevStats.powerUsage,
      noise: stats.noise !== prevStats.noise,
      rf: stats.rf !== prevStats.rf,
      network: stats.network !== prevStats.network,
    }
    setHighlightedStats(newHighlights)
    // ذخیره آمار فعلی برای مقایسه بعدی
    setPrevStats(stats)
    // حذف برجستگی‌ها پس از 2 ثانیه
    const timer = setTimeout(() => {
      setHighlightedStats({
        total: false,
        powerUsage: false,
        noise: false,
        rf: false,
        network: false,
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [stats, prevStats, loading])

  // به‌روزرسانی دستی آمار
  const handleUpdateStats = async () => {
    try {
      setIsUpdating(true)
      // فراخوانی API برای به‌روزرسانی آمار
      const response = await fetch("/api/update-stats")
      if (!response.ok) {
        throw new Error("خطا در به‌روزرسانی آمار")
      }
      // به‌روزرسانی داده‌ها
      await refreshData()
      // نمایش پیام موفقیت
      toast({
        title: "به‌روزرسانی موفق",
        description: "آمار با موفقیت به‌روزرسانی شد",
        variant: "default",
      })
    } catch (err) {
      console.error("خطا در به‌روزرسانی آمار:", err)
      setError("خطا در به‌روزرسانی آمار")
    } finally {
      setIsUpdating(false)
    }
  }

  // نمایش تغییرات هفتگی
  const getWeeklyChange = (type: string) => {
    switch (type) {
      case "total":
        return "+" + weeklyChanges.total
      case "powerUsage":
        return "+" + weeklyChanges.powerUsage
      case "noise":
        return "+" + weeklyChanges.noise
      case "rf":
        return "+" + weeklyChanges.rf
      case "network":
        return "+" + weeklyChanges.network
      default:
        return "+0"
    }
  }

  if (loading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل موارد شناسایی شده</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تشخیص با مصرف برق</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تشخیص با نویز صوتی</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تشخیص با ترافیک شبکه</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          </CardContent>
        </Card>
      </>
    )
  }

  if (error) {
    return (
      <Card className="col-span-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
            تلاش مجدد
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={cn("transition-colors duration-500", highlightedStats.total && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">کل موارد شناسایی شده</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">{getWeeklyChange("total")} در هفته گذشته</p>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleUpdateStats} disabled={isUpdating}>
              <RefreshCw className={cn("h-3 w-3", isUpdating && "animate-spin")} />
              <span className="sr-only">به‌روزرسانی آمار</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className={cn("transition-colors duration-500", highlightedStats.powerUsage && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">تشخیص با مصرف برق</CardTitle>
          <Radio className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.powerUsage}</div>
          <p className="text-xs text-muted-foreground">{getWeeklyChange("powerUsage")} در هفته گذشته</p>
        </CardContent>
      </Card>
      <Card className={cn("transition-colors duration-500", highlightedStats.noise && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">تشخیص با نویز صوتی</CardTitle>
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.noise}</div>
          <p className="text-xs text-muted-foreground">{getWeeklyChange("noise")} در هفته گذشته</p>
        </CardContent>
      </Card>
      <Card className={cn("transition-colors duration-500", highlightedStats.network && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">تشخیص با ترافیک شبکه</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.network}</div>
          <p className="text-xs text-muted-foreground">{getWeeklyChange("network")} در هفته گذشته</p>
        </CardContent>
      </Card>
    </>
  )
}
