"use client"

import Link from "next/link"
import { useDetectionDetail } from "@/lib/use-detection-detail"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Printer, Download, Share2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DetectionDetailHeader({ id }: { id: string }) {
  const { detection } = useDetectionDetail(id)

  const handlePrint = () => {
    toast({
      title: "چاپ گزارش",
      description: "گزارش تشخیص در حال آماده‌سازی برای چاپ است.",
    })
    // In a real app, this would trigger a print dialog
    window.print()
  }

  const handleDownload = () => {
    toast({
      title: "دانلود گزارش",
      description: "گزارش تشخیص با موفقیت دانلود شد.",
    })
    // In a real app, this would trigger a download
  }

  const handleShare = () => {
    toast({
      title: "اشتراک‌گذاری گزارش",
      description: "لینک گزارش در کلیپ‌بورد کپی شد.",
    })
    // In a real app, this would copy a link to clipboard or open a share dialog
    navigator.clipboard.writeText(window.location.href)
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "تایید شده":
        return "default"
      case "در حال بررسی":
        return "outline"
      case "رد شده":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/detections" className="hover:underline">
            تشخیص‌ها
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>جزئیات تشخیص</span>
          <ChevronRight className="h-4 w-4" />
          <span>{detection.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">تشخیص ماینر در {detection.location}</h1>
          <Badge variant={getStatusVariant(detection.status)}>{detection.status}</Badge>
        </div>
        <p className="text-muted-foreground">
          شناسایی شده با روش <span className="font-medium">{detection.method}</span> در تاریخ{" "}
          <span className="font-medium">{detection.timestamp}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 self-start">
        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handlePrint}>
          <Printer className="h-3.5 w-3.5" />
          <span>چاپ</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleDownload}>
          <Download className="h-3.5 w-3.5" />
          <span>دانلود</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleShare}>
          <Share2 className="h-3.5 w-3.5" />
          <span>اشتراک‌گذاری</span>
        </Button>
      </div>
    </div>
  )
}
