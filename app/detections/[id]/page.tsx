import { Suspense } from "react"
import { notFound } from "next/navigation"
import { WebSocketProvider } from "@/lib/websocket-provider"
import { DetectionDetailHeader } from "@/components/detection-detail/detection-detail-header"
import { DetectionOverview } from "@/components/detection-detail/detection-overview"
import { SensorDataTabs } from "@/components/detection-detail/sensor-data-tabs"
import { DetectionTimeline } from "@/components/detection-detail/detection-timeline"
import { RelatedDetections } from "@/components/detection-detail/related-detections"
import { DetectionActions } from "@/components/detection-detail/detection-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"

export default function DetectionDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we would validate the ID and check if it exists
  // For demo purposes, we'll just check if it's a valid-looking ID
  if (!params.id || !/^\d+$/.test(params.id)) {
    notFound()
  }

  return (
    <WebSocketProvider>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto py-6">
          <div className="flex flex-col gap-6">
            <Suspense fallback={<Skeleton className="h-12 w-full max-w-md" />}>
              <DetectionDetailHeader id={params.id} />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                  <DetectionOverview id={params.id} />
                </Suspense>

                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <SensorDataTabs id={params.id} />
                </Suspense>

                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <DetectionTimeline id={params.id} />
                </Suspense>
              </div>

              <div className="space-y-6">
                <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                  <DetectionActions id={params.id} />
                </Suspense>

                <Separator />

                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <RelatedDetections id={params.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </main>
    </WebSocketProvider>
  )
}
