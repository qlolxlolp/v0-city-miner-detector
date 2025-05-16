"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWebSocket } from "@/lib/websocket-provider"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function RecentDetections() {
  const { recentDetections } = useWebSocket()
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set())

  // Effect to highlight new detections
  useEffect(() => {
    if (recentDetections.length > 0) {
      // Get the ID of the most recent detection
      const newId = recentDetections[0].id

      // Add it to the highlighted set
      setHighlightedIds((prev) => new Set([...prev, newId]))

      // Remove the highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedIds((prev) => {
          const newSet = new Set([...prev])
          newSet.delete(newId)
          return newSet
        })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [recentDetections])

  return (
    <Card>
      <CardHeader>
        <CardTitle>آخرین موارد شناسایی شده</CardTitle>
        <CardDescription>گزارش‌های اخیر کشف ماینر</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDetections.map((detection) => (
            <div
              key={detection.id}
              className={cn(
                "flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 transition-colors duration-500",
                highlightedIds.has(detection.id) && "bg-yellow-50 -mx-4 px-4 py-2 rounded-md",
              )}
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{detection.location}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{detection.method}</p>
                  <p className="text-xs text-muted-foreground">•</p>
                  <p className="text-xs text-muted-foreground">{detection.timestamp}</p>
                </div>
              </div>
              <Badge
                variant={
                  detection.status === "تایید شده"
                    ? "default"
                    : detection.status === "در حال بررسی"
                      ? "outline"
                      : "secondary"
                }
              >
                {detection.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
