"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Calendar,
  Zap,
  Radio,
  Volume2,
  Wifi,
  BarChart2,
  ChevronRight,
  FileText,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useDetectionDetail } from "@/lib/use-detection-detail"

export function MobileDetectionDetail({ id }: { id: string }) {
  const { detection, sensorData, loading, error } = useDetectionDetail(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] md:hidden">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">در حال بارگذاری جزئیات...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px] md:hidden">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    )
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
    <div className="space-y-4 md:hidden">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/detections">
            <ChevronRight className="h-4 w-4 ml-1" />
            بازگشت
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-primary/10 p-1.5 rounded-md flex items-center justify-center">
              {getMethodIcon(detection.method)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium truncate">{detection.location}</div>
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
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-muted-foreground">{detection.method}</div>
                <div className="text-xs text-muted-foreground">{detection.timestamp}</div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                  <div
                    className={cn("h-full rounded-full", getConfidenceColor(detection.confidence))}
                    style={{ width: `${detection.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{formatConfidence(detection.confidence)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">خلاصه</TabsTrigger>
          <TabsTrigger value="data">داده‌ها</TabsTrigger>
          <TabsTrigger value="actions">عملیات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
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
        </TabsContent>

        <TabsContent value="data" className="mt-4 space-y-4">
          <Card>
            <Tabs defaultValue="chart">
              <TabsList className="w-full">
                <TabsTrigger value="chart">نمودار</TabsTrigger>
                <TabsTrigger value="raw">داده خام</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="p-4">
                <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-md">
                  <p className="text-sm text-muted-foreground">نمودار داده‌های سنسور</p>
                </div>
              </TabsContent>
              <TabsContent value="raw" className="p-4">
                <div className="text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">زمان</div>
                    <div className="font-medium">مقدار</div>
                    {sensorData &&
                      sensorData.powerUsage &&
                      sensorData.powerUsage.map((item, index) => (
                        <>
                          <div key={`time-${index}`} className="text-muted-foreground">
                            {item.time}
                          </div>
                          <div key={`value-${index}`}>{item.value} kW</div>
                        </>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full" asChild>
              <Link href={`/api/reports/${detection.id}`} target="_blank">
                <FileText className="h-4 w-4 ml-2" />
                دریافت گزارش
              </Link>
            </Button>
            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 ml-2" />
              افزودن یادداشت
            </Button>
            <Button variant="default" className="w-full">
              تایید تشخیص
            </Button>
            <Button variant="secondary" className="w-full">
              رد تشخیص
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
