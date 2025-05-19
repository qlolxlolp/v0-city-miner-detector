"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MethodComparisonProps {
  data?: {
    name: string
    powerUsage: number
    networkTraffic: number
    rfSignal: number
    noiseLevel: number
  }[]
}

export function MethodComparison({ data }: MethodComparisonProps) {
  // اگر داده‌ای وجود نداشت، از داده‌های نمونه استفاده می‌کنیم
  const chartData = data || [
    {
      name: "روش ۱",
      powerUsage: 85,
      networkTraffic: 70,
      rfSignal: 60,
      noiseLevel: 55,
    },
    {
      name: "روش ۲",
      powerUsage: 75,
      networkTraffic: 80,
      rfSignal: 65,
      noiseLevel: 60,
    },
    {
      name: "روش ۳",
      powerUsage: 65,
      networkTraffic: 75,
      rfSignal: 80,
      noiseLevel: 70,
    },
    {
      name: "روش ۴",
      powerUsage: 70,
      networkTraffic: 65,
      rfSignal: 75,
      noiseLevel: 85,
    },
  ]

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>مقایسه روش‌های تشخیص</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value}%`, ""]}
                labelStyle={{ textAlign: "right", direction: "rtl" }}
                contentStyle={{ textAlign: "right", direction: "rtl" }}
              />
              <Legend />
              <Bar dataKey="powerUsage" name="مصرف برق" fill="#8884d8" />
              <Bar dataKey="networkTraffic" name="ترافیک شبکه" fill="#82ca9d" />
              <Bar dataKey="rfSignal" name="سیگنال RF" fill="#ffc658" />
              <Bar dataKey="noiseLevel" name="سطح نویز" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
