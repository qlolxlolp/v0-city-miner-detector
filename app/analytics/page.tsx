import { Suspense } from "react"
import { WebSocketProvider } from "@/lib/websocket-provider"
import { ConnectionStatus } from "@/components/connection-status"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { DetectionTrends } from "@/components/analytics/detection-trends"
import { DetectionHeatmap } from "@/components/analytics/detection-heatmap"
import { MethodComparisonChart } from "@/components/analytics/method-comparison-chart"
import { ConfidenceDistribution } from "@/components/analytics/confidence-distribution"
import { GeographicalDistribution } from "@/components/analytics/geographical-distribution"
import { SuccessRateAnalysis } from "@/components/analytics/success-rate-analysis"

export default function AnalyticsPage() {
  return (
    <WebSocketProvider>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">تحلیل روند تشخیص</h1>
                <p className="text-muted-foreground">نمودارها و تحلیل‌های پیشرفته برای بررسی الگوهای استخراج</p>
              </div>
              <ConnectionStatus />
            </div>

            <AnalyticsHeader />

            <Tabs defaultValue="trends" className="space-y-4">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
                <TabsTrigger value="trends">روند زمانی</TabsTrigger>
                <TabsTrigger value="heatmap">نقشه حرارتی</TabsTrigger>
                <TabsTrigger value="methods">مقایسه روش‌ها</TabsTrigger>
                <TabsTrigger value="confidence">توزیع اطمینان</TabsTrigger>
                <TabsTrigger value="geographical">توزیع جغرافیایی</TabsTrigger>
                <TabsTrigger value="success">نرخ موفقیت</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <DetectionTrends />
                </Suspense>
              </TabsContent>

              <TabsContent value="heatmap" className="space-y-4">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <DetectionHeatmap />
                </Suspense>
              </TabsContent>

              <TabsContent value="methods" className="space-y-4">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <MethodComparisonChart />
                </Suspense>
              </TabsContent>

              <TabsContent value="confidence" className="space-y-4">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <ConfidenceDistribution />
                </Suspense>
              </TabsContent>

              <TabsContent value="geographical" className="space-y-4">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <GeographicalDistribution />
                </Suspense>
              </TabsContent>

              <TabsContent value="success" className="space-y-4">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <SuccessRateAnalysis />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </WebSocketProvider>
  )
}
