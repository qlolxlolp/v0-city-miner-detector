import { Suspense } from "react"
import { DetectionDetailHeader } from "@/components/detection-detail/detection-detail-header"
import { DetectionOverview } from "@/components/detection-detail/detection-overview"
import { SensorDataTabs } from "@/components/detection-detail/sensor-data-tabs"
import { DetectionTimeline } from "@/components/detection-detail/detection-timeline"
import { RelatedDetections } from "@/components/detection-detail/related-detections"
import { DetectionActions } from "@/components/detection-detail/detection-actions"
import { AddNoteForm } from "@/components/detection-detail/add-note-form"
import { MobileHeader } from "@/components/mobile-header"
import { MobileDetectionDetail } from "@/components/mobile-detection-detail"
import { UserNav } from "@/components/user-nav"
import { DateTimeDisplay } from "@/components/date-time-display"

export default function DetectionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Mobile Detection Detail */}
      <Suspense
        fallback={<div className="h-[500px] flex items-center justify-center md:hidden">در حال بارگذاری...</div>}
      >
        <div className="p-4 md:hidden">
          <MobileDetectionDetail id={params.id} />
        </div>
      </Suspense>

      {/* Desktop Detection Detail */}
      <div className="hidden md:block flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Suspense fallback={<div className="h-10 w-64 rounded-lg bg-muted animate-pulse" />}>
            <DetectionDetailHeader id={params.id} />
          </Suspense>
          <div className="flex items-center gap-4">
            <DateTimeDisplay />
            <UserNav />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted animate-pulse" />}>
              <DetectionOverview id={params.id} />
            </Suspense>

            <Suspense fallback={<div className="h-[400px] rounded-lg bg-muted animate-pulse" />}>
              <SensorDataTabs id={params.id} />
            </Suspense>

            <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted animate-pulse" />}>
              <DetectionTimeline id={params.id} />
            </Suspense>
          </div>

          <div className="space-y-4">
            <Suspense fallback={<div className="h-[200px] rounded-lg bg-muted animate-pulse" />}>
              <DetectionActions id={params.id} />
            </Suspense>

            <Suspense fallback={<div className="h-[200px] rounded-lg bg-muted animate-pulse" />}>
              <AddNoteForm id={params.id} />
            </Suspense>

            <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted animate-pulse" />}>
              <RelatedDetections id={params.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
