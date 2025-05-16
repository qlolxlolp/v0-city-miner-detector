import { Suspense } from "react"
import Link from "next/link"
import { MapContainer } from "@/components/map-container"
import { DetectionMethodsCard } from "@/components/detection-methods-card"
import { DetectionStats } from "@/components/detection-stats"
import { RecentDetections } from "@/components/recent-detections"
import { DetectionChart } from "@/components/detection-chart"
import { ConnectionStatus } from "@/components/connection-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { WebSocketProvider } from "@/lib/websocket-provider"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { BarChart3, List } from "lucide-react"
import { DbSetupButton } from "@/components/db-setup-button"

export default function Home() {
  return (
    <WebSocketProvider>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">شکارچی برق - سامانه کشف ماینرهای پنهان</h1>
                <p className="text-muted-foreground">سیستم هوشمند شناسایی و ردیابی ماینرهای غیرمجاز</p>
              </div>
              <div className="flex items-center gap-4">
                <ConnectionStatus />
                <Link href="/detections">
                  <Button variant="outline" className="gap-2">
                    <List className="h-4 w-4" />
                    <span>مشاهده همه</span>
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>تحلیل روند</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">راه‌اندازی پایگاه داده</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 mb-3">
                برای راه‌اندازی پایگاه داده Supabase و پر کردن آن با داده‌های نمونه، از دکمه‌های زیر استفاده کنید.
              </p>
              <DbSetupButton />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DetectionStats />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2">
                <Tabs defaultValue="map">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="map">نقشه موقعیت‌ها</TabsTrigger>
                    <TabsTrigger value="chart">نمودار تحلیلی</TabsTrigger>
                  </TabsList>
                  <TabsContent value="map" className="border rounded-md">
                    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                      <MapContainer />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="chart">
                    <DetectionChart />
                  </TabsContent>
                </Tabs>
              </div>
              <div className="space-y-6">
                <DetectionMethodsCard />
                <RecentDetections />
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </main>
    </WebSocketProvider>
  )
}
