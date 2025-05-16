"use client"

import { useWebSocket } from "@/lib/websocket-provider"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const { isConnected, lastUpdate } = useWebSocket()

  // Format the last update time
  const formattedLastUpdate = lastUpdate
    ? `آخرین بروزرسانی: ${lastUpdate.toLocaleTimeString("fa-IR")}`
    : "در انتظار اتصال..."

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5" />
            <span>متصل</span>
          </Badge>
          <span className="text-xs text-muted-foreground">{formattedLastUpdate}</span>
        </>
      ) : (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1.5">
          <WifiOff className="h-3.5 w-3.5" />
          <span>قطع اتصال</span>
        </Badge>
      )}
    </div>
  )
}
