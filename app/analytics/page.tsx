import { Suspense } from "react"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { MobileHeader } from "@/components/mobile-header"
import { MobileAnalytics } from "@/components/mobile-analytics"
import { UserNav } from "@/components/user-nav"
import { DateTimeDisplay } from "@/components/date-time-display"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Mobile Analytics */}
      <Suspense
        fallback={<div className="h-[500px] flex items-center justify-center md:hidden">در حال بارگذاری...</div>}
      >
        <div className="p-4 md:hidden">
          <MobileAnalytics />
        </div>
      </Suspense>

      {/* Desktop Analytics */}
      <div className="hidden md:block flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">تحلیل‌ها</h2>
          <div className="flex items-center gap-4">
            <DateTimeDisplay />
            <UserNav />
          </div>
        </div>

        <Suspense fallback={<div className="h-[800px] rounded-lg bg-muted animate-pulse" />}>
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </div>
  )
}
