"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { FileText, Loader2 } from "lucide-react"

interface ReportButtonProps {
  detectionId: string
}

export function ReportButton({ detectionId }: ReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)

      // Request the PDF from the API
      const response = await fetch(`/api/reports/${detectionId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "خطا در تولید گزارش PDF")
      }

      // Get the PDF blob
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a link element
      const link = document.createElement("a")
      link.href = url
      link.download = `detection-${detectionId}.pdf`

      // Append to the document
      document.body.appendChild(link)

      // Trigger the download
      link.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      toast({
        title: "گزارش تولید شد",
        description: "گزارش PDF با موفقیت تولید و دانلود شد.",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در تولید گزارش PDF",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleGenerateReport} disabled={isGenerating} className="w-full gap-2">
      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
      <span>دانلود گزارش PDF</span>
    </Button>
  )
}
