import { Suspense } from "react"
import { FilterBar } from "@/components/filter-bar"
import { DetectionTable } from "@/components/detection-table"
import { ConnectionStatus } from "@/components/connection-status"
import { WebSocketProvider } from "@/lib/websocket-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toaster"

export default function DetectionsPage() {
  return (
    <WebSocketProvider>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">تشخیص‌های ماینر</h1>
                <p className="text-muted-foreground">مدیریت و جستجوی موارد شناسایی شده</p>
              </div>
              <ConnectionStatus />
            </div>

            <FilterBar />

            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <DetectionTable />
            </Suspense>
          </div>
        </div>
        <Toaster />
      </main>
    </WebSocketProvider>
  )
}
