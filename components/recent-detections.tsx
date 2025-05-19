"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWebSocket } from "@/lib/websocket-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function RecentDetections() {
  const { recentDetections, refreshData } = useWebSocket()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshData()
      toast({
        title: "به‌روزرسانی موفق",
        description: "لیست تشخیص‌های اخیر با موفقیت به‌روزرسانی شد",
        variant: "default",
      })
    } catch (error) {
      console.error("خطا در به‌روزرسانی داده‌ها:", error)
      toast({
        title: "خطا در به‌روزرسانی",
        description: "مشکلی در به‌روزرسانی داده‌ها رخ داد",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
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

  // Get method color
  const getMethodColor = (method: string) => {
    switch (method) {
      case "مصرف برق":
        return "text-amber-500"
      case "نویز صوتی":
        return "text-green-500"
      case "سیگنال RF":
        return "text-indigo-500"
      case "ترافیک شبکه":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>تشخیص‌های اخیر</CardTitle>
          <CardDescription>آخرین موارد تشخیص داده شده</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          <span className="sr-only">به‌روزرسانی</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDetections.length > 0 ? (
            recentDetections.map((detection) => (
              <div key={detection.id} className="flex items-start gap-4">
                <div
                  className={cn(
                    "mt-1 h-2 w-2 rounded-full",
                    detection.confidence >= 0.8
                      ? "bg-green-500"
                      : detection.confidence >= 0.6
                        ? "bg-amber-500"
                        : "bg-red-500",
                  )}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link href={`/detections/${detection.id}`} className="font-medium hover:underline">
                      {detection.location}
                    </Link>
                    <Badge variant={getStatusVariant(detection.status)}>{detection.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className={cn("", getMethodColor(detection.method))}>{detection.method}</span>
                    <span>{detection.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              <p>هیچ تشخیصی یافت نشد</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
