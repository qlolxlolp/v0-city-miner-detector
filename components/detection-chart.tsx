"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"

export function DetectionChart() {
  const data = [
    {
      name: "فروردین",
      "مصرف برق": 12,
      "نویز صوتی": 8,
      "سیگنال RF": 5,
      "ترافیک شبکه": 7,
    },
    {
      name: "اردیبهشت",
      "مصرف برق": 15,
      "نویز صوتی": 10,
      "سیگنال RF": 6,
      "ترافیک شبکه": 9,
    },
    {
      name: "خرداد",
      "مصرف برق": 18,
      "نویز صوتی": 12,
      "سیگنال RF": 8,
      "ترافیک شبکه": 11,
    },
    {
      name: "تیر",
      "مصرف برق": 22,
      "نویز صوتی": 15,
      "سیگنال RF": 10,
      "ترافیک شبکه": 13,
    },
    {
      name: "مرداد",
      "مصرف برق": 25,
      "نویز صوتی": 18,
      "سیگنال RF": 12,
      "ترافیک شبکه": 15,
    },
    {
      name: "شهریور",
      "مصرف برق": 20,
      "نویز صوتی": 14,
      "سیگنال RF": 9,
      "ترافیک شبکه": 12,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>آمار تشخیص ماهانه</CardTitle>
        <CardDescription>تعداد موارد شناسایی شده به تفکیک روش</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            "مصرف برق": {
              label: "مصرف برق",
              color: "hsl(var(--chart-1))",
            },
            "نویز صوتی": {
              label: "نویز صوتی",
              color: "hsl(var(--chart-2))",
            },
            "سیگنال RF": {
              label: "سیگنال RF",
              color: "hsl(var(--chart-3))",
            },
            "ترافیک شبکه": {
              label: "ترافیک شبکه",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="مصرف برق" fill="var(--color-مصرف-برق)" />
            <Bar dataKey="نویز صوتی" fill="var(--color-نویز-صوتی)" />
            <Bar dataKey="سیگنال RF" fill="var(--color-سیگنال-RF)" />
            <Bar dataKey="ترافیک شبکه" fill="var(--color-ترافیک-شبکه)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
