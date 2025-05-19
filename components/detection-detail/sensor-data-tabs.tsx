"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDetectionDetail } from "@/lib/use-detection-detail"
import { PowerUsageChart } from "@/components/detection-detail/sensor-charts/power-usage-chart"
import { NoiseAnalysisChart } from "@/components/detection-detail/sensor-charts/noise-analysis-chart"
import { RFSignalChart } from "@/components/detection-detail/sensor-charts/rf-signal-chart"
import { NetworkTrafficChart } from "@/components/detection-detail/sensor-charts/network-traffic-chart"
import { SensorDataTable } from "@/components/detection-detail/sensor-data-table"
import { Loader2, AlertCircle, Database } from "lucide-react"

export function SensorDataTabs({ id }: { id: string }) {
  const { detection, sensorData, loading, error } = useDetectionDetail(id)

  // مدیریت حالت‌های بارگذاری و خطا
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">در حال بارگذاری داده‌های سنسور...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-destructive">خطا در بارگذاری داده‌های سنسور</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // تعیین تب‌های قابل نمایش بر اساس روش تشخیص
  const showPowerTab = detection?.method === "مصرف برق" || (sensorData?.powerUsage && sensorData.powerUsage.length > 0)
  const showNoiseTab = detection?.method === "نویز صوتی" || (sensorData?.noiseLevel && sensorData.noiseLevel.length > 0)
  const showRFTab = detection?.method === "سیگنال RF" || (sensorData?.rfSignal && sensorData.rfSignal.length > 0)
  const showNetworkTab =
    detection?.method === "ترافیک شبکه" || (sensorData?.networkTraffic && sensorData.networkTraffic.length > 0)

  // بررسی وجود داده برای نمایش
  const hasData = showPowerTab || showNoiseTab || showRFTab || showNetworkTab

  if (!hasData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center gap-2 text-center">
              <Database className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">داده‌ای برای نمایش وجود ندارد</p>
              <p className="text-xs text-muted-foreground">هیچ داده سنسوری برای این تشخیص ثبت نشده است</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // تعیین تب پیش‌فرض بر اساس روش تشخیص
  const getDefaultTab = () => {
    if (!detection) return "power"

    switch (detection.method) {
      case "مصرف برق":
        return showPowerTab ? "power" : "raw"
      case "نویز صوتی":
        return showNoiseTab ? "noise" : "raw"
      case "سیگنال RF":
        return showRFTab ? "rf" : "raw"
      case "ترافیک شبکه":
        return showNetworkTab ? "network" : "raw"
      default:
        return showPowerTab ? "power" : "raw"
    }
  }

  return (
    <Card>
      <Tabs defaultValue={getDefaultTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {showPowerTab && <TabsTrigger value="power">مصرف برق</TabsTrigger>}
          {showNoiseTab && <TabsTrigger value="noise">نویز صوتی</TabsTrigger>}
          {showRFTab && <TabsTrigger value="rf">سیگنال RF</TabsTrigger>}
          {showNetworkTab && <TabsTrigger value="network">ترافیک شبکه</TabsTrigger>}
          <TabsTrigger value="raw">داده‌های خام</TabsTrigger>
        </TabsList>

        {showPowerTab && (
          <TabsContent value="power">
            <CardContent className="p-4 pt-6">
              <PowerUsageChart data={sensorData.powerUsage} />
            </CardContent>
          </TabsContent>
        )}

        {showNoiseTab && (
          <TabsContent value="noise">
            <CardContent className="p-4 pt-6">
              <NoiseAnalysisChart data={sensorData.noiseLevel} />
            </CardContent>
          </TabsContent>
        )}

        {showRFTab && (
          <TabsContent value="rf">
            <CardContent className="p-4 pt-6">
              <RFSignalChart data={sensorData.rfSignal} />
            </CardContent>
          </TabsContent>
        )}

        {showNetworkTab && (
          <TabsContent value="network">
            <CardContent className="p-4 pt-6">
              <NetworkTrafficChart data={sensorData.networkTraffic} />
            </CardContent>
          </TabsContent>
        )}

        <TabsContent value="raw">
          <CardContent className="p-4 pt-6">
            <SensorDataTable sensorData={sensorData} method={detection.method} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
