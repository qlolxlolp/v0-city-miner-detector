"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function UpdateStatsButton() {
  const [loading, setLoading] = useState(false)

  const updateStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/update-stats")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "به‌روزرسانی موفق",
          description: "آمار با موفقیت به‌روزرسانی شد",
          variant: "default",
        })
      } else {
        toast({
          title: "خطا",
          description: data.error || "خطا در به‌روزرسانی آمار",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("خطا در به‌روزرسانی آمار:", error)
      toast({
        title: "خطا",
        description: "خطا در ارتباط با سرور",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={updateStats} disabled={loading} className="flex items-center gap-1">
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      <span>به‌روزرسانی آمار</span>
    </Button>
  )
}
