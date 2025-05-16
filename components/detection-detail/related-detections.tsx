"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDetectionDetail } from "@/lib/use-detection-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Radio, Volume2, Wifi } from "lucide-react"
import Link from "next/link"

export function RelatedDetections({ id }: { id: string }) {
  const { relatedDetections } = useDetectionDetail(id)

  // Get method icon
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "مصرف برق":
        return <Zap className="h-4 w-4 text-amber-500" />
      case "نویز صوتی":
        return <Volume2 className="h-4 w-4 text-green-500" />
      case "سیگنال RF":
        return <Radio className="h-4 w-4 text-indigo-500" />
      case "ترافیک شبکه":
        return <Wifi className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
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
    <Card>
      <CardHeader>
        <CardTitle>تشخیص‌های مرتبط</CardTitle>
        <CardDescription>تشخیص‌های مرتبط با این موقعیت یا الگو</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedDetections.length > 0 ? (
            relatedDetections.map((detection) => (
              <div
                key={detection.id}
                className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {getMethodIcon(detection.method)}
                    <p className="text-sm font-medium leading-none">{detection.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{detection.method}</p>
                    <p className="text-xs text-muted-foreground">•</p>
                    <p className="text-xs text-muted-foreground">{detection.timestamp}</p>
                  </div>
                  <Badge variant={getStatusVariant(detection.status)} className="mt-1">
                    {detection.status}
                  </Badge>
                </div>
                <Link href={`/detections/${detection.id}`}>
                  <Button variant="ghost" size="sm">
                    مشاهده
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>هیچ تشخیص مرتبطی یافت نشد.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
