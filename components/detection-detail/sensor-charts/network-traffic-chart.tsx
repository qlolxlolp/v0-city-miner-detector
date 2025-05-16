"use client"

import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, BarChart, Bar } from "recharts"
import type { SensorDataPoint } from "@/lib/use-detection-detail"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NetworkTrafficChartProps {
  data: SensorDataPoint[]
}

export function NetworkTrafficChart({ data }: NetworkTrafficChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate average, min, and max values
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length
  const min = Math.min(...data.map((item) => item.value))
  const max = Math.max(...data.map((item) => item.value))

  // Calculate threshold for mining detection (for demonstration)
  const threshold = 500 // Mbps threshold for mining detection

  // Calculate protocol distribution (mock data for demonstration)
  const protocolData = [
    { name: "TCP", value: 65 },
    { name: "UDP", value: 10 },
    { name: "HTTP/S", value: 5 },
    { name: "Mining Protocols", value: 20 },
  ]

  // Calculate destination distribution (mock data for demonstration)
  const destinationData = [
    { name: "Mining Pool 1", value: 45 },
    { name: "Mining Pool 2", value: 30 },
    { name: "Other", value: 25 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">میانگین ترافیک</CardTitle>
            <CardDescription>میانگین ترافیک شبکه</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{average.toFixed(1)} Mbps</div>
            <p className="text-xs text-muted-foreground">
              {average > threshold ? "بالاتر از حد نرمال" : "در محدوده نرمال"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداکثر ترافیک</CardTitle>
            <CardDescription>بیشترین ترافیک ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{max.toFixed(1)} Mbps</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === max)?.timestamp}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">حداقل ترافیک</CardTitle>
            <CardDescription>کمترین ترافیک ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{min.toFixed(1)} Mbps</div>
            <p className="text-xs text-muted-foreground">در {data.find((item) => item.value === min)?.timestamp}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3">
          <TabsTrigger value="traffic">ترافیک شبکه</TabsTrigger>
          <TabsTrigger value="protocol">توزیع پروتکل</TabsTrigger>
          <TabsTrigger value="destination">مقاصد ترافیک</TabsTrigger>
        </TabsList>
        <TabsContent value="traffic">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                "ترافیک شبکه": {
                  label: "ترافیک شبکه",
                  color: "hsl(200, 80%, 50%)",
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
                <Tooltip formatter={(value) => `${value} Mbps`} />
                <Legend />
                <ReferenceLine y={threshold} label="آستانه تشخیص" stroke="hsl(0, 84%, 60%)" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="ترافیک شبکه"
                  stroke="hsl(200, 80%, 50%)"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>
        <TabsContent value="protocol">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                درصد: {
                  label: "درصد",
                  color: "hsl(200, 80%, 50%)",
                },
              }}
            >
              <BarChart data={protocolData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                />
                <YAxis
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                  domain={[0, 100]}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="value" name="درصد" fill="hsl(200, 80%, 50%)" />
              </BarChart>
            </ChartContainer>
          </div>
        </TabsContent>
        <TabsContent value="destination">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                درصد: {
                  label: "درصد",
                  color: "hsl(200, 80%, 50%)",
                },
              }}
            >
              <BarChart data={destinationData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                />
                <YAxis
                  stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                  tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                  domain={[0, 100]}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="value" name="درصد" fill="hsl(200, 80%, 50%)" />
              </BarChart>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">تحلیل ترافیک شبکه</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
          تحلیل ترافیک شبکه نشان می‌دهد که میزان ترافیک در این موقعیت به طور میانگین {average.toFixed(1)} مگابیت بر ثانیه
          است که {average > threshold ? "بالاتر از" : "نزدیک به"} آستانه تشخیص ({threshold} مگابیت بر ثانیه) برای
          دستگاه‌های استخراج رمزارز است. بررسی پروتکل‌های مورد استفاده نشان می‌دهد که حدود 20% از ترافیک مربوط به پروتکل‌های
          استخراج رمزارز است و حدود 75% از ترافیک به سمت استخرهای استخراج رمزارز هدایت می‌شود.
        </p>
      </div>
    </div>
  )
}
