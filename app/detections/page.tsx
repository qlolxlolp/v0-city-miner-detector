import { Suspense } from "react"
import { WebSocketProvider } from "@/lib/websocket-provider"
import { FilterBar } from "@/components/filter-bar"
import { DetectionTable } from "@/components/detection-table"
import { MobileHeader } from "@/components/mobile-header"
import { UserNav } from "@/components/user-nav"
import { DateTimeDisplay } from "@/components/date-time-display"

export default function DetectionsPage() {
  return (
    <WebSocketProvider>
      <div className="flex min-h-screen flex-col">
        {/* Mobile Header */}
        <MobileHeader />

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight hidden md:block">تشخیص‌ها</h2>
            <div className="flex items-center gap-4">
              <DateTimeDisplay className="hidden md:block" />
              <div className="hidden md:block">
                <UserNav />
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="h-[100px] rounded-lg bg-muted animate-pulse" />}>
            <FilterBar />
          </Suspense>

          <Suspense fallback={<div className="h-[500px] rounded-lg bg-muted animate-pulse" />}>
            <DetectionTable />
          </Suspense>
        </div>
      </div>
    </WebSocketProvider>
  )
}
