"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCircle, AlertTriangle, AlertCircleIcon, Info, RefreshCw } from "lucide-react"
import { db } from "@/lib/db"
import { alerts } from "@/lib/schema"
import { eq, desc } from "drizzle-orm"
import { useAuth } from "@/lib/auth-context"

interface Alert {
  id: number
  detectionId: string | null
  deviceId: number | null
  type: string
  severity: string
  title: string
  message: string
  isRead: boolean
  isResolved: boolean
  timestamp: string
  resolvedAt: string | null
  resolvedBy: string | null
}

export function AlertSystem() {
  const { user } = useAuth()
  const [alertList, setAlertList] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchAlerts()

    // به‌روزرسانی خودکار هر ۳۰ ثانیه
    const interval = setInterval(fetchAlerts, 30000)

    return () => clearInterval(interval)
  }, [activeTab])

  const fetchAlerts = async () => {
    try {
      setIsRefreshing(true)

      // ساخت کوئری بر اساس تب فعال
      let query = db.select().from(alerts).orderBy(desc(alerts.timestamp))

      if (activeTab === "unread") {
        query = query.where(eq(alerts.isRead, false))
      } else if (activeTab === "unresolved") {
        query = query.where(eq(alerts.isResolved, false))
      } else if (activeTab === "critical") {
        query = query.where(eq(alerts.severity, "critical"))
      } else if (activeTab === "high") {
        query = query.where(eq(alerts.severity, "high"))
      } else if (activeTab === "medium") {
        query = query.where(eq(alerts.severity, "medium"))
      } else if (activeTab === "low") {
        query = query.where(eq(alerts.severity, "low"))
      }

      const data = await query
      setAlertList(data)
      setError(null)
    } catch (error) {
      console.error("خطا در دریافت هشدارها:", error)
      setError("خطا در دریافت هشدارها. لطفاً دوباره تلاش کنید.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchAlerts()
  }

  const markAsRead = async (alertId: number) => {
    try {
      await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, alertId))

      // به‌روزرسانی لیست هشدارها
      setAlertList((prevAlerts) =>
        prevAlerts.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)),
      )
    } catch (error) {
      console.error("خطا در علامت‌گذاری هشدار:", error)
      setError("خطا در علامت‌گذاری هشدار. لطفاً دوباره تلاش کنید.")
    }
  }

  const resolveAlert = async (alertId: number) => {
    try {
      await db
        .update(alerts)
        .set({
          isResolved: true,
          resolvedAt: new Date().toISOString(),
          resolvedBy: user?.id,
        })
        .where(eq(alerts.id, alertId))

      // به‌روزرسانی لیست هشدارها
      setAlertList((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                isResolved: true,
                resolvedAt: new Date().toISOString(),
                resolvedBy: user?.id,
              }
            : alert,
        ),
      )
    } catch (error) {
      console.error("خطا در حل هشدار:", error)
      setError("خطا در حل هشدار. لطفاً دوباره تلاش کنید.")
    }
  }

  // دریافت رنگ مناسب برای هر سطح اهمیت
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // دریافت آیکون مناسب برای هر سطح اهمیت
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircleIcon className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "low":
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  // ترجمه سطح اهمیت به فارسی
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "critical":
        return "بحرانی"
      case "high":
        return "بالا"
      case "medium":
        return "متوسط"
      case "low":
        return "پایین"
      default:
        return severity
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>سیستم هشدار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>سیستم هشدار</CardTitle>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          به‌روزرسانی
        </Button>
      </CardHeader>
      <CardContent>
        {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">{error}</div>}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="unread">خوانده نشده</TabsTrigger>
            <TabsTrigger value="unresolved">حل نشده</TabsTrigger>
            <TabsTrigger value="critical">بحرانی</TabsTrigger>
            <TabsTrigger value="high">بالا</TabsTrigger>
            <TabsTrigger value="medium">متوسط</TabsTrigger>
            <TabsTrigger value="low">پایین</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {alertList.length > 0 ? (
            alertList.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${!alert.isRead ? "bg-slate-50" : ""}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {getSeverityIcon(alert.severity)}
                      <span className="mr-1">{getSeverityText(alert.severity)}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString("fa-IR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {!alert.isRead && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(alert.id)}>
                        <Bell className="mr-1 h-3 w-3" />
                        علامت خوانده شده
                      </Button>
                    )}

                    {!alert.isResolved && (
                      <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        حل شده
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="font-medium text-lg">{alert.title}</h3>
                <p className="text-sm mt-1">{alert.message}</p>

                {alert.isResolved && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    حل شده در {new Date(alert.resolvedAt!).toLocaleString("fa-IR")}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">هیچ هشداری یافت نشد.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
