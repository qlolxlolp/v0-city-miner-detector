"use client"

import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts"
import type { SensorDataPoint } from "@/lib/use-detection-detail"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PowerUsageChartProps {
  data: SensorDataPoint[]
}

export function PowerUsageChart({ data }: PowerUsageChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate average, min, and max values
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length
  const min = Math.min(...data.map((item) => item.value))
  const max = Math.max(...data.map((item) => item.value))

  // Calculate threshold for mining detection (for demonstration)
  const threshold = average * 1.5

  // Calculate percentage above normal
  const percentAboveNormal = ((average - 1200) / 1200) * 100

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین مصرف</CardTitle>
            <CardDescription>میانگین مصرف برق</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{average.toFixed(1)} وات</div>
            <p className="text-xs text-muted-foreground">
              {percentAboveNormal > 0 ? "+" : ""}
              {percentAboveNormal.toFixed(1)}% نسبت به حالت عادی
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداکثر مصرف</CardTitle>
            <CardDescription>بیشترین مصرف ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{max.toFixed(1)} وات</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === max)?.timestamp}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداقل مصرف</CardTitle>
            <CardDescription>کمترین مصرف ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{min.toFixed(1)} وات</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === min)?.timestamp}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="line">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="line">نمودار خطی</TabsTrigger>
          <TabsTrigger value="detailed">تحلیل جزئیات</TabsTrigger>
        </TabsList>
        <TabsContent value="line">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                "مصرف برق": {
                  label: "مصرف برق",
                  color: "hsl(20, 90%, 60%)",
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
                <Tooltip formatter={(value) => `${value} وات`} />
                <Legend />
                <ReferenceLine y={threshold} label="آستانه تشخیص" stroke="hsl(0, 84%, 60%)" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="مصرف برق"
                  stroke="hsl(20, 90%, 60%)"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
        <TabsContent value="detailed">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                "مصرف برق": {
                  label: "مصرف برق",
                  color: "hsl(20, 90%, 60%)",
                },
                "مصرف نرمال": {
                  label: "مصرف نرمال",
                  color: "hsl(120, 60%, 50%)",
                },
                اختلاف: {
                  label: "اختلاف",
                  color: "hsl(260, 70%, 60%)",
                },
              }}
            >
              <LineChart
                data={data.map((item) => ({
                  ...item,
                  normal: 1200, // Baseline normal consumption
                  difference: item.value - 1200,
                }))}
              >
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
                />
                <Tooltip formatter={(value) => `${value} وات`} />
                <Legend />
                <Line type="monotone" dataKey="value" name="مصرف برق" stroke="hsl(20, 90%, 60%)" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="normal"
                  name="مصرف نرمال"
                  stroke="hsl(120, 60%, 50%)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="difference" name="اختلاف" stroke="hsl(260, 70%, 60%)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-800">
        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">تحلیل مصرف برق</h3>
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
          الگوی مصرف برق در این موقعیت نشان‌دهنده افزایش {percentAboveNormal.toFixed(1)} درصدی نسبت به مصرف نرمال است.
          این الگو با الگوی مصرف دستگاه‌های استخراج رمزارز مطابقت دارد. نوسانات مصرف در ساعات مختلف نیز با الگوی فعالیت
          ماینرها همخوانی دارد.
        </p>
      </div>
    </div>
  )
}
