import { Suspense } from "react"
import { WebSocketProvider } from "@/lib/websocket-provider"
import { DetectionStats } from "@/components/detection-stats"
import { MapContainer } from "@/components/map-container"
import { RecentDetections } from "@/components/recent-detections"
import { DetectionMethodsCard } from "@/components/detection-methods-card"
import { DetectionChart } from "@/components/detection-chart"
import { ConnectionStatus } from "@/components/connection-status"
import { UpdateStatsButton } from "@/components/update-stats-button"
import { DbSetupButton } from "@/components/db-setup-button"
import { DateTimeDisplay } from "@/components/date-time-display"
import { HardwareStatus } from "@/components/hardware-status"
import { AlertSystem } from "@/components/alert-system"
import { AutomatedReports } from "@/components/automated-reports"
import { MobileHeader } from "@/components/mobile-header"
import { MobileDashboard } from "@/components/mobile-dashboard"
import { UserNav } from "@/components/user-nav"

export default function Home() {
  return (
    <WebSocketProvider>
      <div className="flex min-h-screen flex-col">
        {/* Mobile Header */}
        <MobileHeader />

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight hidden md:block">داشبورد</h2>
            <div className="flex items-center gap-4">
              <DateTimeDisplay className="hidden md:block" />
              <div className="hidden md:block">
                <UserNav />
              </div>
            </div>
          </div>

          {/* Mobile Dashboard */}
          <Suspense
            fallback={<div className="h-[500px] flex items-center justify-center md:hidden">در حال بارگذاری...</div>}
          >
            <MobileDashboard />
          </Suspense>

          {/* Desktop Dashboard */}
          <div className="hidden md:block">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Suspense fallback={<div className="h-[120px] rounded-lg bg-muted animate-pulse" />}>
                <DetectionStats />
              </Suspense>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
              <div className="col-span-4">
                <div className="grid gap-4">
                  <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted animate-pulse" />}>
                    <MapContainer />
                  </Suspense>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted animate-pulse" />}>
                      <DetectionMethodsCard />
                    </Suspense>
                    <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted animate-pulse" />}>
                      <DetectionChart />
                    </Suspense>
                  </div>
                </div>
              </div>
              <div className="col-span-3">
                <div className="grid gap-4">
                  <Suspense fallback={<div className="h-[400px] rounded-lg bg-muted animate-pulse" />}>
                    <RecentDetections />
                  </Suspense>
                  <Suspense fallback={<div className="h-[200px] rounded-lg bg-muted animate-pulse" />}>
                    <ConnectionStatus />
                  </Suspense>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Suspense fallback={<div className="h-[200px] rounded-lg bg-muted animate-pulse" />}>
                      <HardwareStatus />
                    </Suspense>
                    <Suspense fallback={<div className="h-[200px] rounded-lg bg-muted animate-pulse" />}>
                      <AlertSystem />
                    </Suspense>
                  </div>
                  <Suspense fallback={<div className="h-[200px] rounded-lg bg-muted animate-pulse" />}>
                    <AutomatedReports />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <DbSetupButton />
              <UpdateStatsButton />
            </div>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  )
}
