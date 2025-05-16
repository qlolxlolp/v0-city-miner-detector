"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDetectionDetail } from "@/lib/use-detection-detail"
import { PowerUsageChart } from "@/components/detection-detail/sensor-charts/power-usage-chart"
import { NoiseAnalysisChart } from "@/components/detection-detail/sensor-charts/noise-analysis-chart"
import { RFSignalChart } from "@/components/detection-detail/sensor-charts/rf-signal-chart"
import { NetworkTrafficChart } from "@/components/detection-detail/sensor-charts/network-traffic-chart"
import { SensorDataTable } from "@/components/detection-detail/sensor-data-table"

export function SensorDataTabs({ id }: { id: string }) {
  const { detection, sensorData } = useDetectionDetail(id)

  // Determine which tabs to show based on the detection method
  const showPowerTab = detection.method === "مصرف برق" || sensorData.powerUsage.length > 0
  const showNoiseTab = detection.method === "نویز صوتی" || sensorData.noiseLevel.length > 0
  const showRFTab = detection.method === "سیگنال RF" || sensorData.rfSignal.length > 0
  const showNetworkTab = detection.method === "ترافیک شبکه" || sensorData.networkTraffic.length > 0

  // Determine default tab based on detection method
  const getDefaultTab = () => {
    switch (detection.method) {
      case "مصرف برق":
        return "power"
      case "نویز صوتی":
        return "noise"
      case "سیگنال RF":
        return "rf"
      case "ترافیک شبکه":
        return "network"
      default:
        return "power"
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
