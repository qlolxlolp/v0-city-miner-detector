"use client"

import { useWebSocket } from "@/lib/websocket-provider"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"

export function ConnectionStatus() {
  const { isConnected, lastUpdate } = useWebSocket()
  const [dbStatus, setDbStatus] = useState<"connected" | "disconnected" | "checking">("checking")

  // بررسی وضعیت اتصال به پایگاه داده
  useEffect(() => {
    async function checkDbConnection() {
      try {
        setDbStatus("checking")
        const { data, error } = await supabaseClient.from("detection_stats").select("last_updated").limit(1)

        if (error) {
          console.error("خطا در بررسی اتصال به پایگاه داده:", error)
          setDbStatus("disconnected")
        } else {
          setDbStatus("connected")
        }
      } catch (err) {
        console.error("خطا در بررسی اتصال به پایگاه داده:", err)
        setDbStatus("disconnected")
      }
    }

    checkDbConnection()

    // بررسی دوره‌ای وضعیت اتصال
    const intervalId = setInterval(checkDbConnection, 30000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-1">
        <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
        <span>وضعیت اتصال: {isConnected ? "متصل" : "قطع"}</span>
      </div>
      <div className="flex items-center gap-1">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            dbStatus === "connected" ? "bg-green-500" : dbStatus === "disconnected" ? "bg-red-500" : "bg-yellow-500",
          )}
        />
        <span>
          وضعیت پایگاه داده: {dbStatus === "connected" ? "متصل" : dbStatus === "disconnected" ? "قطع" : "در حال بررسی"}
        </span>
      </div>
      {lastUpdate && (
        <div>
          <span>آخرین به‌روزرسانی: {new Date(lastUpdate).toLocaleTimeString("fa-IR")}</span>
        </div>
      )}
    </div>
  )
}
