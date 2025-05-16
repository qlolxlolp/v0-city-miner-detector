"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"
import { useAnalyticsData } from "@/lib/use-analytics-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DetectionTrends() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { timeSeriesData } = useAnalyticsData()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle>روند تشخیص ماینرها در طول زمان</CardTitle>
            <CardDescription>تعداد موارد شناسایی شده به تفکیک روش در طول زمان</CardDescription>
          </div>
          <Tabs defaultValue="daily" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">روزانه</TabsTrigger>
              <TabsTrigger value="weekly">هفتگی</TabsTrigger>
              <TabsTrigger value="monthly">ماهانه</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={{
              "مصرف برق": {
                label: "مصرف برق",
                color: "hsl(20, 90%, 60%)",
              },
              "نویز صوتی": {
                label: "نویز صوتی",
                color: "hsl(120, 60%, 50%)",
              },
              "سیگنال RF": {
                label: "سیگنال RF",
                color: "hsl(260, 70%, 60%)",
              },
              "ترافیک شبکه": {
                label: "ترافیک شبکه",
                color: "hsl(200, 80%, 50%)",
              },
              کل: {
                label: "کل",
                color: "hsl(0, 0%, 50%)",
              },
            }}
          >
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(20, 90%, 60%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(20, 90%, 60%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNoise" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(120, 60%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(120, 60%, 50%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorRF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(260, 70%, 60%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(260, 70%, 60%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 0%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(0, 0%, 50%)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
              />
              <XAxis
                dataKey="date"
                stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
              />
              <YAxis
                stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="مصرف برق"
                stroke="hsl(20, 90%, 60%)"
                fillOpacity={1}
                fill="url(#colorPower)"
              />
              <Area
                type="monotone"
                dataKey="نویز صوتی"
                stroke="hsl(120, 60%, 50%)"
                fillOpacity={1}
                fill="url(#colorNoise)"
              />
              <Area
                type="monotone"
                dataKey="سیگنال RF"
                stroke="hsl(260, 70%, 60%)"
                fillOpacity={1}
                fill="url(#colorRF)"
              />
              <Area
                type="monotone"
                dataKey="ترافیک شبکه"
                stroke="hsl(200, 80%, 50%)"
                fillOpacity={1}
                fill="url(#colorNetwork)"
              />
              <Area
                type="monotone"
                dataKey="کل"
                stroke="hsl(0, 0%, 50%)"
                fillOpacity={1}
                fill="url(#colorTotal)"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
