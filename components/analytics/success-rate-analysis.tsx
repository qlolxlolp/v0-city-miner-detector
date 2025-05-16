"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { useAnalyticsData } from "@/lib/use-analytics-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SuccessRateAnalysis() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { successRateData } = useAnalyticsData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>تحلیل نرخ موفقیت تشخیص</CardTitle>
        <CardDescription>روند نرخ موفقیت تشخیص‌ها در طول زمان</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overall">کلی</TabsTrigger>
            <TabsTrigger value="byMethod">به تفکیک روش</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  "نرخ موفقیت": {
                    label: "نرخ موفقیت",
                    color: "hsl(142, 76%, 36%)",
                  },
                  "نرخ خطا": {
                    label: "نرخ خطا",
                    color: "hsl(0, 84%, 60%)",
                  },
                }}
              >
                <LineChart data={successRateData}>
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
                    domain={[0, 100]}
                    label={{ value: "درصد", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <ReferenceLine y={75} label="هدف" stroke="#8884d8" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="نرخ موفقیت"
                    stroke="hsl(142, 76%, 36%)"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="نرخ خطا" stroke="hsl(0, 84%, 60%)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="byMethod" className="space-y-4">
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
                }}
              >
                <LineChart data={successRateData}>
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
                    domain={[0, 100]}
                    label={{ value: "درصد موفقیت", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <ReferenceLine y={75} label="هدف" stroke="#8884d8" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="مصرف برق" stroke="hsl(20, 90%, 60%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="نویز صوتی" stroke="hsl(120, 60%, 50%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="سیگنال RF" stroke="hsl(260, 70%, 60%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="ترافیک شبکه" stroke="hsl(200, 80%, 50%)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
