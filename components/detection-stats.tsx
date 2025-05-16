"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Radio, Volume2, Wifi } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-provider"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function DetectionStats() {
  const { stats } = useWebSocket()
  const [highlightedStats, setHighlightedStats] = useState<Record<string, boolean>>({
    total: false,
    powerUsage: false,
    noise: false,
    rf: false,
    network: false,
  })

  // Previous stats for comparison
  const [prevStats, setPrevStats] = useState(stats)

  // Effect to highlight changed stats
  useEffect(() => {
    const newHighlights: Record<string, boolean> = {
      total: stats.total !== prevStats.total,
      powerUsage: stats.powerUsage !== prevStats.powerUsage,
      noise: stats.noise !== prevStats.noise,
      rf: stats.rf !== prevStats.rf,
      network: stats.network !== prevStats.network,
    }

    setHighlightedStats(newHighlights)

    // Save current stats for next comparison
    setPrevStats(stats)

    // Remove highlights after 2 seconds
    const timer = setTimeout(() => {
      setHighlightedStats({
        total: false,
        powerUsage: false,
        noise: false,
        rf: false,
        network: false,
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [stats, prevStats])

  // Calculate weekly changes (mock data)
  const getWeeklyChange = (current: number, type: string) => {
    // In a real app, this would compare with historical data
    switch (type) {
      case "total":
        return "+" + (current > 120 ? current - 120 : 5)
      case "powerUsage":
        return "+" + (current > 75 ? current - 75 : 3)
      case "noise":
        return "+" + (current > 40 ? current - 40 : 2)
      case "rf":
        return "+" + (current > 30 ? current - 30 : 1)
      case "network":
        return "+" + (current > 30 ? current - 30 : 1)
      default:
        return "+0"
    }
  }

  return (
    <>
      <Card className={cn("transition-colors duration-500", highlightedStats.total && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">کل موارد شناسایی شده</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">{getWeeklyChange(stats.total, "total")} در هفته گذشته</p>
        </CardContent>
      </Card>
      <Card className={cn("transition-colors duration-500", highlightedStats.powerUsage && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">تشخیص با مصرف برق</CardTitle>
          <Radio className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.powerUsage}</div>
          <p className="text-xs text-muted-foreground">
            {getWeeklyChange(stats.powerUsage, "powerUsage")} در هفته گذشته
          </p>
        </CardContent>
      </Card>
      <Card className={cn("transition-colors duration-500", highlightedStats.noise && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">تشخیص با نویز صوتی</CardTitle>
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.noise}</div>
          <p className="text-xs text-muted-foreground">{getWeeklyChange(stats.noise, "noise")} در هفته گذشته</p>
        </CardContent>
      </Card>
      <Card className={cn("transition-colors duration-500", highlightedStats.network && "bg-yellow-50")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">تشخیص با ترافیک شبکه</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.network}</div>
          <p className="text-xs text-muted-foreground">{getWeeklyChange(stats.network, "network")} در هفته گذشته</p>
        </CardContent>
      </Card>
    </>
  )
}
