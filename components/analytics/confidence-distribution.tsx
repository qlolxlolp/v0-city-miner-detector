"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { useAnalyticsData } from "@/lib/use-analytics-data"
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts"
import { useState } from "react"

export function ConfidenceDistribution() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { confidenceDistributionData } = useAnalyticsData()
  const [activeIndex, setActiveIndex] = useState(0)

  const COLORS = ["#4ade80", "#facc15", "#fb923c", "#ef4444"]

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} مورد`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>توزیع سطح اطمینان تشخیص</CardTitle>
        <CardDescription>تعداد تشخیص‌ها بر اساس سطح اطمینان الگوریتم</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={{
              confidence: {
                label: "سطح اطمینان",
                color: "hsl(0, 0%, 50%)",
              },
            }}
          >
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={confidenceDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {confidenceDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-sm">بالا (۹۰-۱۰۰٪)</span>
          </div>
          <div className="flex items-center gap-2 mx-4">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm">متوسط (۷۵-۹۰٪)</span>
          </div>
          <div className="flex items-center gap-2 mx-4">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-sm">پایین (۶۰-۷۵٪)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">ضعیف (زیر ۶۰٪)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
