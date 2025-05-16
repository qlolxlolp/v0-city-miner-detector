"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { useAnalyticsData } from "@/lib/use-analytics-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MethodComparisonChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { methodComparisonData, methodSuccessRateData } = useAnalyticsData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>مقایسه روش‌های تشخیص</CardTitle>
        <CardDescription>مقایسه کارایی روش‌های مختلف تشخیص ماینر</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="count" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="count">تعداد تشخیص</TabsTrigger>
            <TabsTrigger value="success">نرخ موفقیت</TabsTrigger>
          </TabsList>

          <TabsContent value="count" className="space-y-4">
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
                <BarChart data={methodComparisonData}>
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
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="مصرف برق" fill="hsl(20, 90%, 60%)">
                    <LabelList dataKey="مصرف برق" position="top" />
                  </Bar>
                  <Bar dataKey="نویز صوتی" fill="hsl(120, 60%, 50%)">
                    <LabelList dataKey="نویز صوتی" position="top" />
                  </Bar>
                  <Bar dataKey="سیگنال RF" fill="hsl(260, 70%, 60%)">
                    <LabelList dataKey="سیگنال RF" position="top" />
                  </Bar>
                  <Bar dataKey="ترافیک شبکه" fill="hsl(200, 80%, 50%)">
                    <LabelList dataKey="ترافیک شبکه" position="top" />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
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
                <BarChart data={methodSuccessRateData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                    tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                    tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="نرخ موفقیت" stackId="a" fill="hsl(142, 76%, 36%)">
                    <LabelList dataKey="نرخ موفقیت" position="center" formatter={(value) => `${value}%`} />
                  </Bar>
                  <Bar dataKey="نرخ خطا" stackId="a" fill="hsl(0, 84%, 60%)">
                    <LabelList dataKey="نرخ خطا" position="center" formatter={(value) => `${value}%`} />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
