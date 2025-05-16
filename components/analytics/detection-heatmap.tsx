"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { useAnalyticsData } from "@/lib/use-analytics-data"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

export function DetectionHeatmap() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { heatmapData } = useAnalyticsData()

  // Color scale for the heatmap
  const getColor = (value: number) => {
    // Color scale from green (low) to red (high)
    if (value < 3) return "#4ade80" // green
    if (value < 6) return "#facc15" // yellow
    if (value < 9) return "#fb923c" // orange
    return "#ef4444" // red
  }

  // Custom tooltip for the heatmap
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border rounded shadow-lg">
          <p className="text-sm font-medium">{`روز: ${data.day}`}</p>
          <p className="text-sm font-medium">{`ساعت: ${data.hour}`}</p>
          <p className="text-sm font-medium">{`تعداد: ${data.value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>نقشه حرارتی تشخیص بر اساس زمان</CardTitle>
        <CardDescription>توزیع تشخیص‌ها بر اساس روز هفته و ساعت روز</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ChartContainer
            config={{
              heatmap: {
                label: "نقشه حرارتی",
                color: "hsl(0, 0%, 50%)",
              },
            }}
          >
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
              />
              <XAxis
                type="number"
                dataKey="hour"
                name="ساعت"
                domain={[0, 23]}
                stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                label={{ value: "ساعت روز", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="dayIndex"
                name="روز"
                domain={[0, 6]}
                stroke={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                tick={{ fill: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                ticks={[0, 1, 2, 3, 4, 5, 6]}
                tickFormatter={(value) => {
                  const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]
                  return days[value]
                }}
                label={{ value: "روز هفته", position: "insideLeft", angle: -90, offset: -10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="نقشه حرارتی تشخیص" data={heatmapData} shape="square">
                {heatmapData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.value)}
                    opacity={0.8}
                    stroke={isDark ? "#1e293b" : "#f8fafc"}
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ChartContainer>
        </div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-sm">کم (۰-۲)</span>
          </div>
          <div className="flex items-center gap-2 mx-4">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm">متوسط (۳-۵)</span>
          </div>
          <div className="flex items-center gap-2 mx-4">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-sm">زیاد (۶-۸)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">بسیار زیاد (۹+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
