import { Suspense } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { UserNav } from "@/components/user-nav"
import { DateTimeDisplay } from "@/components/date-time-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar } from "lucide-react"
import Link from "next/link"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader />

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight hidden md:block">گزارش‌ها</h2>
          <div className="flex items-center gap-4">
            <DateTimeDisplay className="hidden md:block" />
            <div className="hidden md:block">
              <UserNav />
            </div>
          </div>
        </div>

        {/* Mobile Reports */}
        <div className="md:hidden space-y-4">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">همه</TabsTrigger>
              <TabsTrigger value="scheduled">زمان‌بندی شده</TabsTrigger>
              <TabsTrigger value="custom">سفارشی</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium truncate">گزارش روزانه</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href="/api/reports/daily" target="_blank">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">دانلود</span>
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-muted-foreground">تشخیص‌های ۲۴ ساعت گذشته</div>
                        <div className="text-xs text-muted-foreground">۱۴۰۳/۰۲/۲۸</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium truncate">گزارش هفتگی</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href="/api/reports/weekly" target="_blank">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">دانلود</span>
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-muted-foreground">تشخیص‌های هفته گذشته</div>
                        <div className="text-xs text-muted-foreground">۱۴۰۳/۰۲/۲۱ - ۱۴۰۳/۰۲/۲۸</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium truncate">گزارش ماهانه</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href="/api/reports/monthly" target="_blank">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">دانلود</span>
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-muted-foreground">تشخیص‌های ماه گذشته</div>
                        <div className="text-xs text-muted-foreground">۱۴۰۳/۰۱/۲۸ - ۱۴۰۳/۰۲/۲۸</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">گزارش‌های زمان‌بندی شده</h3>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 ml-2" />
                  افزودن
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium truncate">گزارش روزانه</div>
                        <Button variant="ghost" size="sm" className="h-7">
                          ویرایش
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-muted-foreground">هر روز ساعت ۸ صبح</div>
                        <div className="text-xs text-muted-foreground">فعال</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium truncate">گزارش هفتگی</div>
                        <Button variant="ghost" size="sm" className="h-7">
                          ویرایش
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-muted-foreground">هر شنبه ساعت ۹ صبح</div>
                        <div className="text-xs text-muted-foreground">فعال</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">گزارش‌های سفارشی</h3>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 ml-2" />
                  ایجاد گزارش
                </Button>
              </div>

              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">گزارش سفارشی ایجاد کنید</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    با انتخاب بازه زمانی و فیلترهای مورد نظر، گزارش سفارشی ایجاد کنید.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Reports */}
        <div className="hidden md:block space-y-4">
          <Suspense fallback={<div className="h-[800px] rounded-lg bg-muted animate-pulse" />}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>گزارش‌ها</CardTitle>
                    <CardDescription>مدیریت و دانلود گزارش‌های سیستم</CardDescription>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 ml-2" />
                    ایجاد گزارش جدید
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">همه گزارش‌ها</TabsTrigger>
                    <TabsTrigger value="scheduled">زمان‌بندی شده</TabsTrigger>
                    <TabsTrigger value="custom">سفارشی</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-right font-medium">عنوان</th>
                            <th className="py-3 px-4 text-right font-medium">نوع</th>
                            <th className="py-3 px-4 text-right font-medium">تاریخ</th>
                            <th className="py-3 px-4 text-right font-medium">وضعیت</th>
                            <th className="py-3 px-4 text-right font-medium">عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">گزارش روزانه</td>
                            <td className="py-3 px-4">روزانه</td>
                            <td className="py-3 px-4">۱۴۰۳/۰۲/۲۸</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                آماده
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href="/api/reports/daily" target="_blank">
                                  <Download className="h-4 w-4 ml-2" />
                                  دانلود
                                </Link>
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">گزارش هفتگی</td>
                            <td className="py-3 px-4">هفتگی</td>
                            <td className="py-3 px-4">۱۴۰۳/۰۲/۲۱ - ۱۴۰۳/۰۲/۲۸</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                آماده
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href="/api/reports/weekly" target="_blank">
                                  <Download className="h-4 w-4 ml-2" />
                                  دانلود
                                </Link>
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">گزارش ماهانه</td>
                            <td className="py-3 px-4">ماهانه</td>
                            <td className="py-3 px-4">۱۴۰۳/۰۱/۲۸ - ۱۴۰۳/۰۲/۲۸</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                آماده
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href="/api/reports/monthly" target="_blank">
                                  <Download className="h-4 w-4 ml-2" />
                                  دانلود
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="scheduled" className="mt-4">
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-right font-medium">عنوان</th>
                            <th className="py-3 px-4 text-right font-medium">زمان‌بندی</th>
                            <th className="py-3 px-4 text-right font-medium">گیرندگان</th>
                            <th className="py-3 px-4 text-right font-medium">وضعیت</th>
                            <th className="py-3 px-4 text-right font-medium">عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">گزارش روزانه</td>
                            <td className="py-3 px-4">هر روز ساعت ۸ صبح</td>
                            <td className="py-3 px-4">۳ گیرنده</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                فعال
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">
                                ویرایش
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">گزارش هفتگی</td>
                            <td className="py-3 px-4">هر شنبه ساعت ۹ صبح</td>
                            <td className="py-3 px-4">۵ گیرنده</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                فعال
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">
                                ویرایش
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">گزارش ماهانه</td>
                            <td className="py-3 px-4">اول هر ماه ساعت ۱۰ صبح</td>
                            <td className="py-3 px-4">۷ گیرنده</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                فعال
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">
                                ویرایش
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="mt-4">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">گزارش سفارشی ایجاد کنید</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-md">
                        با انتخاب بازه زمانی، فیلترها و قالب مورد نظر، گزارش سفارشی ایجاد کنید.
                      </p>
                      <Button className="mt-4">
                        <FileText className="h-4 w-4 ml-2" />
                        ایجاد گزارش سفارشی
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
