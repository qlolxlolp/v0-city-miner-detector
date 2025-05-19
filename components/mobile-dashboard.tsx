"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Radio, Volume2, Wifi, BarChart2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useWebSocket } from "@/lib/websocket-provider"

export function MobileDashboard() {
  const { recentDetections, detectionStats, refreshData } = useWebSocket()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshData()
    } catch (error) {
      console.error("خطا در به‌روزرسانی داده‌ها:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Get method icon
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "مصرف برق":
        return <Zap className="h-5 w-5 text-amber-500" />
      case "نویز صوتی":
        return <Volume2 className="h-5 w-5 text-green-500" />
      case "سیگنال RF":
        return <Radio className="h-5 w-5 text-indigo-500" />
      case "ترافیک شبکه":
        return <Wifi className="h-5 w-5 text-blue-500" />
      default:
        return <BarChart2 className="h-5 w-5 text-gray-500" />
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "تایید شده":
        return "default"
      case "در حال بررسی":
        return "outline"
      case "رد شده":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4 md:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">داشبورد</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
          به‌روزرسانی
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">کل تشخیص‌ها</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{detectionStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {detectionStats.totalChange > 0 ? "+" : ""}
              {detectionStats.totalChange}% نسبت به ماه قبل
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">تایید شده</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{detectionStats.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              {detectionStats.confirmedChange > 0 ? "+" : ""}
              {detectionStats.confirmedChange}% نسبت به ماه قبل
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">در حال بررسی</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{detectionStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {detectionStats.pendingChange > 0 ? "+" : ""}
              {detectionStats.pendingChange}% نسبت به ماه قبل
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">رد شده</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{detectionStats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              {detectionStats.rejectedChange > 0 ? "+" : ""}
              {detectionStats.rejectedChange}% نسبت به ماه قبل
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">تشخیص‌های اخیر</TabsTrigger>
          <TabsTrigger value="alerts">هشدارها</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4 space-y-4">
          {recentDetections.length > 0 ? (
            recentDetections.map((detection) => (
              <Link key={detection.id} href={`/detections/${detection.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-primary/10 p-1.5 rounded-md flex items-center justify-center">
                        {getMethodIcon(detection.method)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium truncate">{detection.location}</div>
                          <Badge variant={getStatusVariant(detection.status)}>{detection.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-sm text-muted-foreground">{detection.method}</div>
                          <div className="text-xs text-muted-foreground">{detection.timestamp}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-full h-1.5 bg-slate-100 rounded-full">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                detection.confidence >= 0.8
                                  ? "bg-green-500"
                                  : detection.confidence >= 0.6
                                    ? "bg-amber-500"
                                    : "bg-red-500",
                              )}
                              style={{ width: `${detection.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{Math.round(detection.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>هیچ تشخیصی یافت نشد</p>
            </div>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/detections">مشاهده همه تشخیص‌ها</Link>
          </Button>
        </TabsContent>
        <TabsContent value="alerts" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-red-100 p-1.5 rounded-md">
                  <Zap className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">هشدار مصرف بالا</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    مصرف برق در منطقه تهرانپارس به طور غیرعادی افزایش یافته است.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">۱۵ دقیقه پیش</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-amber-100 p-1.5 rounded-md">
                  <Radio className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium">سیگنال RF مشکوک</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    سیگنال RF مشکوک در منطقه شهرک غرب شناسایی شده است.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">۲ ساعت پیش</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-100 p-1.5 rounded-md">
                  <Wifi className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">ترافیک شبکه غیرعادی</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ترافیک شبکه غیرعادی در منطقه سعادت‌آباد شناسایی شده است.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">دیروز</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/alerts">مشاهده همه هشدارها</Link>
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
