"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, TrendingUp, PieChart, Map, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileAnalytics() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("7days")

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-4 md:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">تحلیل‌ها</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
          به‌روزرسانی
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">۷ روز گذشته</SelectItem>
            <SelectItem value="30days">۳۰ روز گذشته</SelectItem>
            <SelectItem value="90days">۳ ماه گذشته</SelectItem>
            <SelectItem value="1year">یک سال گذشته</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="methods">
            <BarChart2 className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="confidence">
            <PieChart className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">روند تشخیص‌ها</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">نمودار روند تشخیص‌ها</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm font-medium">کل تشخیص‌ها</div>
                  <div className="text-2xl font-bold mt-1">۱۲۵</div>
                </div>
                <div>
                  <div className="text-sm font-medium">تایید شده</div>
                  <div className="text-2xl font-bold mt-1">۸۷</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="mt-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">مقایسه روش‌ها</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">نمودار مقایسه روش‌ها</p>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">مصرف برق</div>
                  <div className="text-sm font-medium">۴۲%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">نویز صوتی</div>
                  <div className="text-sm font-medium">۲۵%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">سیگنال RF</div>
                  <div className="text-sm font-medium">۱۸%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">ترافیک شبکه</div>
                  <div className="text-sm font-medium">۱۵%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confidence" className="mt-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">توزیع اطمینان</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">نمودار توزیع اطمینان</p>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">۰-۲۰%</div>
                  <div className="text-sm font-medium">۵ مورد</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">۲۱-۴۰%</div>
                  <div className="text-sm font-medium">۱۰ مورد</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">۴۱-۶۰%</div>
                  <div className="text-sm font-medium">۲۰ مورد</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">۶۱-۸۰%</div>
                  <div className="text-sm font-medium">۳۵ مورد</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">۸۱-۱۰۰%</div>
                  <div className="text-sm font-medium">۳۰ مورد</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">توزیع جغرافیایی</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">نقشه توزیع جغرافیایی</p>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">تهران</div>
                  <div className="text-sm font-medium">۳۵ مورد</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">اصفهان</div>
                  <div className="text-sm font-medium">۲۲ مورد</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">مشهد</div>
                  <div className="text-sm font-medium">۱۸ مورد</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">شیراز</div>
                  <div className="text-sm font-medium">۱۵ مورد</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
