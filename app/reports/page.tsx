import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDetections } from "@/lib/supabase/functions"
import { ReportButton } from "@/components/detection-detail/report-button"
import { Skeleton } from "@/components/ui/skeleton"

async function ReportList() {
  const detections = await getDetections()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {detections.map((detection) => (
        <Card key={detection.id}>
          <CardHeader>
            <CardTitle>{detection.location}</CardTitle>
            <CardDescription>
              {new Date(detection.timestamp).toLocaleDateString("fa-IR")} - {detection.method}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>وضعیت:</span>
                <span>{detection.status}</span>
              </div>
              <div className="flex justify-between">
                <span>اطمینان:</span>
                <span>{detection.confidence}%</span>
              </div>
              <div className="mt-4">
                <ReportButton detectionId={detection.id.toString()} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  return (
    <main className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">گزارش‌های تشخیص</h1>
        <p className="text-muted-foreground">از این صفحه می‌توانید گزارش‌های PDF برای تشخیص‌های مختلف تولید کنید.</p>
      </div>

      <Suspense fallback={<ReportListSkeleton />}>
        <ReportList />
      </Suspense>
    </main>
  )
}

function ReportListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
