"use client"

import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts"
import type { SensorDataPoint } from "@/lib/use-detection-detail"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NoiseAnalysisChartProps {
  data: SensorDataPoint[]
}

export function NoiseAnalysisChart({ data }: NoiseAnalysisChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate average, min, and max values
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length
  const min = Math.min(...data.map((item) => item.value))
  const max = Math.max(...data.map((item) => item.value))

  // Calculate threshold for mining detection (for demonstration)
  const threshold = 65 // dB threshold for mining detection

  // Calculate frequency data (mock data for demonstration)
  const frequencyData = [
    { frequency: "50 Hz", amplitude: 0.2 },
    { frequency: "100 Hz", amplitude: 0.3 },
    { frequency: "200 Hz", amplitude: 0.8 },
    { frequency: "500 Hz", amplitude: 1.0 },
    { frequency: "1 kHz", amplitude: 0.7 },
    { frequency: "2 kHz", amplitude: 0.5 },
    { frequency: "5 kHz", amplitude: 0.3 },
    { frequency: "10 kHz", amplitude: 0.1 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین نویز</CardTitle>
            <CardDescription>میانگین سطح نویز صوتی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{average.toFixed(1)} dB</div>
            <p className="text-xs text-muted-foreground">{average > 60 ? "بالاتر از حد مجاز" : "در محدوده مجاز"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداکثر نویز</CardTitle>
            <CardDescription>بیشترین سطح نویز ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{max.toFixed(1)} dB</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === max)?.timestamp}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداقل نویز</CardTitle>
            <CardDescription>کمترین سطح نویز ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{min.toFixed(1)} dB</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === min)?.timestamp}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="time">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="time">نمودار زمانی</TabsTrigger>
          <TabsTrigger value="frequency">تحلیل فرکانسی</TabsTrigger>
        </TabsList>
        <TabsContent value="time">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                "سطح نویز": {
                  label: "سطح نویز",
                  color: "hsl(120, 60%, 50%)",
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
                <Tooltip formatter={(value) => `${value} dB`} />
                <Legend />
                <ReferenceLine y={threshold} label="آستانه تشخیص" stroke="hsl(0, 84%, 60%)" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="سطح نویز"
                  stroke="hsl(120, 60%, 50%)"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
        <TabsContent value="frequency">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                دامنه: {
                  label: "دامنه",
                  color: "hsl(260, 70%, 60%)",
                },
              }}
            >
              <LineChart data={frequencyData}>
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
                  domain={[0, 1.1]}
                />
                <Tooltip formatter={(value) => `${value} (نرمال شده)`} />
                <Legend />
                <Line type="monotone" dataKey="amplitude" name="دامنه" stroke="hsl(260, 70%, 60%)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-800">
        <h3 className="text-sm font-medium text-green-800 dark:text-green-300">تحلیل نویز صوتی</h3>
        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
          تحلیل نویز صوتی نشان می‌دهد که سطح نویز در این موقعیت به طور میانگین {average.toFixed(1)} دسیبل است که{" "}
          {average > threshold ? "بالاتر از" : "نزدیک به"} آستانه تشخیص ({threshold} دسیبل) برای دستگاه‌های استخراج
          رمزارز است. تحلیل فرکانسی نیز نشان‌دهنده وجود فرکانس‌های مشخصه فن‌های خنک‌کننده دستگاه‌های ماینر در محدوده 200 تا
          500 هرتز است.
        </p>
      </div>
    </div>
  )
}
