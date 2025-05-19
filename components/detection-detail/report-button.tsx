"use client"

import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface ReportButtonProps {
  id: string
}

export function ReportButton({ id }: ReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)

      // درخواست به API برای تولید گزارش
      const response = await fetch(`/api/reports/${id}`)

      if (!response.ok) {
        throw new Error("خطا در تولید گزارش")
      }

      // دریافت blob از پاسخ
      const blob = await response.blob()

      // ایجاد URL برای دانلود
      const url = window.URL.createObjectURL(blob)

      // ایجاد لینک دانلود
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${id}.pdf`
      document.body.appendChild(a)
      a.click()

      // پاکسازی
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "گزارش با موفقیت تولید شد",
        description: "گزارش PDF با موفقیت دانلود شد",
        variant: "default",
      })
    } catch (error) {
      console.error("خطا در تولید گزارش:", error)
      toast({
        title: "خطا در تولید گزارش",
        description: "مشکلی در تولید گزارش رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          در حال تولید گزارش...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          دریافت گزارش PDF
        </>
      )}
    </Button>
  )
}
