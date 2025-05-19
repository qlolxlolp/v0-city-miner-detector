"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface DetectionTrendChartProps {
  data?: any[]
  period?: string
  isLoading?: boolean
}

export function DetectionTrendChart({ data, period = "daily", isLoading = false }: DetectionTrendChartProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily")
  const [chartData, setChartData] = useState<any[]>([])

  // تولید داده‌های نمونه اگر داده واقعی وجود نداشته باشد
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data)
    } else {
      // تولید داده‌های نمونه
      generateSampleData(activeTab)
    }
  }, [data, activeTab])

  const generateSampleData = (tab: string) => {
    const result = []
    const now = new Date()

    if (tab === "daily") {
      // داده‌های روزانه برای ۷ روز گذشته
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        result.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          detections: Math.floor(Math.random() * 40) + 10,
          confirmed: Math.floor(Math.random() * 30) + 5,
        })
      }
    } else if (tab === "weekly") {
      // داده‌های هفتگی برای ۸ هفته گذشته
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i * 7)

        result.push({
          date: `هفته ${8 - i}`,
          detections: Math.floor(Math.random() * 150) + 50,
          confirmed: Math.floor(Math.random() * 100) + 30,
        })
      }
    } else if (tab === "monthly") {
      // داده‌های ماهانه برای ۶ ماه گذشته
      const months = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ]

      for (let i = 5; i >= 0; i--) {
        const monthIndex = (now.getMonth() - i + 12) % 12

        result.push({
          date: months[monthIndex],
          detections: Math.floor(Math.random() * 300) + 100,
          confirmed: Math.floor(Math.random() * 200) + 80,
        })
      }
    }

    setChartData(result)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "daily" | "weekly" | "monthly")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>روند تشخیص</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>روند تشخیص</CardTitle>
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="daily">روزانه</TabsTrigger>
            <TabsTrigger value="weekly">هفتگی</TabsTrigger>
            <TabsTrigger value="monthly">ماهانه</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{ textAlign: "right", direction: "rtl" }}
                formatter={(value, name) => {
                  const persianNames: Record<string, string> = {
                    detections: "تشخیص‌ها",
                    confirmed: "تأیید شده",
                  }
                  return [value, persianNames[name] || name]
                }}
              />
              <Legend
                formatter={(value) => {
                  const persianNames: Record<string, string> = {
                    detections: "تشخیص‌ها",
                    confirmed: "تأیید شده",
                  }
                  return persianNames[value] || value
                }}
              />
              <Line type="monotone" dataKey="detections" stroke="#8884d8" activeDot={{ r: 8 }} name="تشخیص‌ها" />
              <Line type="monotone" dataKey="confirmed" stroke="#82ca9d" name="تأیید شده" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
