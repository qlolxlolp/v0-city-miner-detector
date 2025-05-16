"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDetectionDetail } from "@/lib/use-detection-detail"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, XCircle, Clock, User, FileText } from "lucide-react"

export function DetectionTimeline({ id }: { id: string }) {
  const { timeline } = useDetectionDetail(id)

  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "detection":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "verification":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejection":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "update":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "assignment":
        return <User className="h-5 w-5 text-indigo-500" />
      case "note":
        return <FileText className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>تاریخچه رویدادها</CardTitle>
        <CardDescription>تاریخچه کامل رویدادهای مرتبط با این تشخیص</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 right-[19px] w-px bg-border" />

          <div className="space-y-6">
            {timeline.map((event, index) => (
              <div key={index} className="relative grid grid-cols-[40px_1fr] gap-4 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background z-10">
                  {getEventIcon(event.type)}
                </div>
                <div className={cn("space-y-1", index === timeline.length - 1 && "pb-0")}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{event.title}</p>
                    <time className="text-xs text-muted-foreground">{event.timestamp}</time>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.user && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {event.user}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
