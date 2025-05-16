"use client"

import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts"
import type { SensorDataPoint } from "@/lib/use-detection-detail"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RFSignalChartProps {
  data: SensorDataPoint[]
}

export function RFSignalChart({ data }: RFSignalChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate average, min, and max values
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length
  const min = Math.min(...data.map((item) => item.value))
  const max = Math.max(...data.map((item) => item.value))

  // Calculate threshold for mining detection (for demonstration)
  const threshold = 75 // dBm threshold for mining detection

  // Calculate spectrum data (mock data for demonstration)
  const spectrumData = [
    { frequency: "2.4 GHz", power: -45 },
    { frequency: "2.41 GHz", power: -50 },
    { frequency: "2.42 GHz", power: -65 },
    { frequency: "2.43 GHz", power: -85 },
    { frequency: "2.44 GHz", power: -90 },
    { frequency: "2.45 GHz", power: -55 },
    { frequency: "2.46 GHz", power: -40 },
    { frequency: "2.47 GHz", power: -60 },
    { frequency: "2.48 GHz", power: -75 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین قدرت سیگنال</CardTitle>
            <CardDescription>میانگین قدرت سیگنال RF</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{average.toFixed(1)} dBm</div>
            <p className="text-xs text-muted-foreground">
              {average > threshold ? "بالاتر از حد نرمال" : "در محدوده نرمال"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداکثر قدرت سیگنال</CardTitle>
            <CardDescription>بیشترین قدرت سیگنال ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{max.toFixed(1)} dBm</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === max)?.timestamp}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداقل قدرت سیگنال</CardTitle>
            <CardDescription>کمترین قدرت سیگنال ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{min.toFixed(1)} dBm</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === min)?.timestamp}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="time">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="time">نمودار زمانی</TabsTrigger>
          <TabsTrigger value="spectrum">تحلیل طیفی</TabsTrigger>
        </TabsList>
        <TabsContent value="time">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                "قدرت سیگنال": {
                  label: "قدرت سیگنال",
                  color: "hsl(260, 70%, 60%)",
                },
                "آستانه تشخیص": {
                  label: "آستانه تشخیص",
                  color: "hsl(0, 84%, 60%)",
                },
              }}
            >
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                />
                <XAxis
                  dataKey="timestamp"
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                />
                <YAxis
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                  domain={[0, Math.max(max * 1.1, threshold * 1.1)]}
                />
                <Tooltip formatter={(value) => `${value} dBm`} />
                <Legend />
                <ReferenceLine y={threshold} label="آستانه تشخیص" stroke="hsl(0, 84%, 60%)" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="قدرت سیگنال"
                  stroke="hsl(260, 70%, 60%)"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
        <TabsContent value="spectrum">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                "قدرت سیگنال": {
                  label: "قدرت سیگنال",
                  color: "hsl(200, 80%, 50%)",
                },
              }}
            >
              <LineChart data={spectrumData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                />
                <XAxis
                  dataKey="frequency"
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                />
                <YAxis
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                  domain={[-100, 0]}
                />
                <Tooltip formatter={(value) => `${value} dBm`} />
                <Legend />
                <Line type="monotone" dataKey="power" name="قدرت سیگنال" stroke="hsl(200, 80%, 50%)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">تحلیل سیگنال RF</h3>
        <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
          تحلیل سیگنال‌های الکترومغناطیسی نشان می‌دهد که قدرت سیگنال در این موقعیت به طور میانگین {average.toFixed(1)}{" "}
          دسیبل‌میلی‌وات است که {average > threshold ? "بالاتر از" : "نزدیک به"} آستانه تشخیص ({threshold} دسیبل‌میلی‌وات)
          برای دستگاه‌های استخراج رمزارز است. تحلیل طیفی نیز نشان‌دهنده وجود سیگنال‌های قوی در باندهای فرکانسی 2.4 و 2.46
          گیگاهرتز است که با الگوی تشعشع دستگاه‌های ماینر مطابقت دارد.
        </p>
      </div>
    </div>
  )
}
