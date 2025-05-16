"use client"

import { useAnalyticsData } from "@/lib/use-analytics-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

import { DetectionTrends } from "./detection-trends"
import { DetectionHeatmap } from "./detection-heatmap"
import { MethodComparison } from "./method-comparison"
import { MethodSuccessRate } from "./method-success-rate"
import { ConfidenceDistribution } from "./confidence-distribution"
import { GeographicalDistribution } from "./geographical-distribution"
import { SuccessRateAnalysis } from "./success-rate-analysis"

export function AnalyticsDashboard() {
  const {
    timeSeriesData,
    heatmapData,
    methodComparisonData,
    methodSuccessRateData,
    confidenceDistributionData,
    geographicalData,
    successRateData,
    loading,
    error,
  } = useAnalyticsData()

  if (loading) {
    return <AnalyticsSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>خطا در بارگیری داده‌های تحلیلی</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Check if we have any data
  const hasData =
    timeSeriesData.length > 0 ||
    heatmapData.length > 0 ||
    methodComparisonData.length > 0 ||
    methodSuccessRateData.length > 0 ||
    confidenceDistributionData.length > 0 ||
    geographicalData.length > 0 ||
    successRateData.length > 0

  if (!hasData) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>داده‌ای یافت نشد</AlertTitle>
        <AlertDescription>
          هیچ داده تحلیلی واقعی در پایگاه داده وجود ندارد. لطفاً منتظر ثبت تشخیص‌های واقعی باشید.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs defaultValue="trends" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="trends">روند تشخیص</TabsTrigger>
        <TabsTrigger value="heatmap">توزیع زمانی</TabsTrigger>
        <TabsTrigger value="methods">مقایسه روش‌ها</TabsTrigger>
        <TabsTrigger value="success">نرخ موفقیت</TabsTrigger>
        <TabsTrigger value="confidence">توزیع اطمینان</TabsTrigger>
        <TabsTrigger value="geographical">توزیع جغرافیایی</TabsTrigger>
        <TabsTrigger value="analysis">تحلیل روند</TabsTrigger>
      </TabsList>

      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>روند تشخیص‌ها</CardTitle>
            <CardDescription>تعداد تشخیص‌ها بر اساس روش در طول زمان</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DetectionTrends data={timeSeriesData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="heatmap" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>توزیع زمانی تشخیص‌ها</CardTitle>
            <CardDescription>تعداد تشخیص‌ها بر اساس روز هفته و ساعت</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DetectionHeatmap data={heatmapData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="methods" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>مقایسه روش‌های تشخیص</CardTitle>
            <CardDescription>تعداد تشخیص‌ها بر اساس روش در ماه‌های مختلف</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <MethodComparison data={methodComparisonData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="success" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>نرخ موفقیت روش‌های تشخیص</CardTitle>
            <CardDescription>مقایسه نرخ موفقیت و خطا برای هر روش تشخیص</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <MethodSuccessRate data={methodSuccessRateData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="confidence" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>توزیع سطح اطمینان</CardTitle>
            <CardDescription>تعداد تشخیص‌ها بر اساس سطح اطمینان</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ConfidenceDistribution data={confidenceDistributionData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="geographical" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>توزیع جغرافیایی تشخیص‌ها</CardTitle>
            <CardDescription>تعداد تشخیص‌ها بر اساس موقعیت جغرافیایی</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <GeographicalDistribution data={geographicalData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analysis" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>تحلیل روند نرخ موفقیت</CardTitle>
            <CardDescription>روند نرخ موفقیت روش‌های مختلف در طول زمان</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <SuccessRateAnalysis data={successRateData} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
