"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface MethodSuccessRateProps {
  data?: {
    name: string
    value: number
    color: string
  }[]
}

export function MethodSuccessRate({ data }: MethodSuccessRateProps) {
  // اگر داده‌ای وجود نداشت، از داده‌های نمونه استفاده می‌کنیم
  const chartData = data || [
    { name: "روش ۱", value: 85, color: "#8884d8" },
    { name: "روش ۲", value: 75, color: "#82ca9d" },
    { name: "روش ۳", value: 90, color: "#ffc658" },
    { name: "روش ۴", value: 65, color: "#ff8042" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>نرخ موفقیت روش‌های تشخیص</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "نرخ موفقیت"]}
                labelStyle={{ textAlign: "right", direction: "rtl" }}
                contentStyle={{ textAlign: "right", direction: "rtl" }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value) => <span style={{ direction: "rtl", textAlign: "right" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
