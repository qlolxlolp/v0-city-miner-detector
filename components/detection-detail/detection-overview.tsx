"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDetectionDetail } from "@/lib/use-detection-detail"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Zap, Radio, Volume2, Wifi, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function DetectionOverview({ id }: { id: string }) {
  const { detection } = useDetectionDetail(id)

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

  // Format confidence as percentage
  const formatConfidence = (value: number) => {
    return `${Math.round(value * 100)}%`
  }

  // Get confidence color
  const getConfidenceColor = (value: number) => {
    if (value >= 0.8) return "bg-green-500"
    if (value >= 0.6) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>خلاصه تشخیص</CardTitle>
        <CardDescription>اطلاعات کلی مربوط به این تشخیص</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">موقعیت</div>
                <div className="text-sm text-muted-foreground">{detection.location}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  مختصات: {detection.coordinates.lat}, {detection.coordinates.lng}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">تاریخ و زمان</div>
                <div className="text-sm text-muted-foreground">{detection.timestamp}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  زمان پردازش: {detection.processingTime || "2 دقیقه و 35 ثانیه"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">وضعیت</div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      detection.status === "تایید شده"
                        ? "default"
                        : detection.status === "در حال بررسی"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {detection.status}
                  </Badge>
                  {detection.status === "تایید شده" && (
                    <span className="text-xs text-muted-foreground">تایید شده توسط: محمد احمدی</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  آخرین بروزرسانی: {detection.lastUpdated || "امروز، 14:25"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md flex items-center justify-center">
                {getMethodIcon(detection.method)}
              </div>
              <div>
                <div className="font-medium">روش تشخیص</div>
                <div className="text-sm text-muted-foreground">{detection.method}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  سنسور: {detection.sensorId || "SEN-" + (Number.parseInt(id) + 1000)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md">
                <BarChart2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">میزان اطمینان</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-full max-w-32 h-2 bg-slate-100 rounded-full">
                    <div
                      className={cn("h-full rounded-full", getConfidenceColor(detection.confidence))}
                      style={{ width: `${detection.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatConfidence(detection.confidence)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {detection.confidence >= 0.8
                    ? "اطمینان بالا"
                    : detection.confidence >= 0.6
                      ? "اطمینان متوسط"
                      : "اطمینان پایین"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">تخمین مصرف</div>
                <div className="text-sm text-muted-foreground">{detection.estimatedPower || "3.5"} کیلووات در ساعت</div>
                <div className="text-xs text-muted-foreground mt-1">
                  تعداد دستگاه تخمینی: {detection.estimatedDevices || "2-4"} دستگاه
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
