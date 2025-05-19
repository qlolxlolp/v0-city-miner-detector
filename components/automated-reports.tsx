"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Plus, RefreshCw, Calendar, Clock, Trash2, Download, CheckCircle, BellOff, Bell } from "lucide-react"
import { db } from "@/lib/db"
import { scheduledReports } from "@/lib/schema"
import { eq, desc } from "drizzle-orm"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

interface ScheduledReport {
  id: number
  name: string
  description: string | null
  type: string
  format: string
  recipients: string[]
  schedule: {
    day?: number
    hour: number
    minute: number
  }
  lastRun: string | null
  nextRun: string | null
  isActive: boolean
  createdBy: string
  createdAt: string
}

export function AutomatedReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ScheduledReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // فرم جدید
  const [newReport, setNewReport] = useState({
    name: "",
    description: "",
    type: "daily",
    format: "pdf",
    recipients: "",
    day: "1",
    hour: "8",
    minute: "0",
    isActive: true,
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setIsRefreshing(true)
      const data = await db.select().from(scheduledReports).orderBy(desc(scheduledReports.createdAt))
      setReports(data)
      setError(null)
    } catch (error) {
      console.error("خطا در دریافت گزارش‌های خودکار:", error)
      setError("خطا در دریافت گزارش‌های خودکار. لطفاً دوباره تلاش کنید.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchReports()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewReport((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewReport((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setNewReport((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // تبدیل رشته گیرندگان به آرایه
      const recipientsArray = newReport.recipients
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email)

      // محاسبه زمان اجرای بعدی
      const nextRun = calculateNextRun(
        newReport.type,
        Number.parseInt(newReport.day),
        Number.parseInt(newReport.hour),
        Number.parseInt(newReport.minute),
      )

      // ایجاد گزارش جدید
      await db.insert(scheduledReports).values({
        name: newReport.name,
        description: newReport.description || null,
        type: newReport.type,
        format: newReport.format,
        recipients: recipientsArray,
        schedule: {
          day: newReport.type !== "daily" ? Number.parseInt(newReport.day) : undefined,
          hour: Number.parseInt(newReport.hour),
          minute: Number.parseInt(newReport.minute),
        },
        nextRun,
        isActive: newReport.isActive,
        createdBy: user?.id,
      })

      // بستن دیالوگ و به‌روزرسانی لیست
      setIsDialogOpen(false)
      fetchReports()

      // پاک کردن فرم
      setNewReport({
        name: "",
        description: "",
        type: "daily",
        format: "pdf",
        recipients: "",
        day: "1",
        hour: "8",
        minute: "0",
        isActive: true,
      })
    } catch (error) {
      console.error("خطا در ایجاد گزارش خودکار:", error)
      setError("خطا در ایجاد گزارش خودکار. لطفاً دوباره تلاش کنید.")
    }
  }

  const toggleReportStatus = async (reportId: number, isActive: boolean) => {
    try {
      await db.update(scheduledReports).set({ isActive: !isActive }).where(eq(scheduledReports.id, reportId))

      // به‌روزرسانی لیست گزارش‌ها
      setReports((prevReports) =>
        prevReports.map((report) => (report.id === reportId ? { ...report, isActive: !isActive } : report)),
      )
    } catch (error) {
      console.error("خطا در تغییر وضعیت گزارش:", error)
      setError("خطا در تغییر وضعیت گزارش. لطفاً دوباره تلاش کنید.")
    }
  }

  const deleteReport = async (reportId: number) => {
    try {
      await db.delete(scheduledReports).where(eq(scheduledReports.id, reportId))

      // به‌روزرسانی لیست گزارش‌ها
      setReports((prevReports) => prevReports.filter((report) => report.id !== reportId))
    } catch (error) {
      console.error("خطا در حذف گزارش:", error)
      setError("خطا در حذف گزارش. لطفاً دوباره تلاش کنید.")
    }
  }

  const runReportNow = async (reportId: number) => {
    try {
      // در یک محیط واقعی، این تابع باید با سیستم گزارش‌گیری ارتباط برقرار کند
      // و گزارش را اجرا کند

      // برای مثال، می‌توان از یک API استفاده کرد
      const response = await fetch(`/api/reports/run/${reportId}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("خطا در اجرای گزارش")
      }

      // به‌روزرسانی زمان اجرای آخر
      await db
        .update(scheduledReports)
        .set({ lastRun: new Date().toISOString() })
        .where(eq(scheduledReports.id, reportId))

      // به‌روزرسانی لیست گزارش‌ها
      fetchReports()
    } catch (error) {
      console.error("خطا در اجرای گزارش:", error)
      setError("خطا در اجرای گزارش. لطفاً دوباره تلاش کنید.")
    }
  }

  // محاسبه زمان اجرای بعدی
  const calculateNextRun = (type: string, day: number, hour: number, minute: number) => {
    const now = new Date()
    const nextRun = new Date()

    // تنظیم ساعت و دقیقه
    nextRun.setHours(hour, minute, 0, 0)

    // اگر زمان تنظیم شده قبل از زمان فعلی است، به روز بعد منتقل می‌شود
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }

    // تنظیم روز بر اساس نوع گزارش
    if (type === "weekly") {
      // روز هفته (0 = یکشنبه، 6 = شنبه)
      const currentDay = nextRun.getDay()
      const daysUntilTarget = (day - currentDay + 7) % 7

      if (daysUntilTarget === 0 && nextRun <= now) {
        // اگر امروز روز هدف است و زمان گذشته، به هفته بعد منتقل می‌شود
        nextRun.setDate(nextRun.getDate() + 7)
      } else {
        nextRun.setDate(nextRun.getDate() + daysUntilTarget)
      }
    } else if (type === "monthly") {
      // روز ماه
      const currentDate = nextRun.getDate()

      if (day < currentDate || (day === currentDate && nextRun <= now)) {
        // اگر روز هدف قبل از روز فعلی است یا امروز روز هدف است و زمان گذشته، به ماه بعد منتقل می‌شود
        nextRun.setMonth(nextRun.getMonth() + 1)
      }

      // تنظیم روز ماه
      nextRun.setDate(Math.min(day, getDaysInMonth(nextRun.getFullYear(), nextRun.getMonth())))
    }

    return nextRun.toISOString()
  }

  // دریافت تعداد روزهای ماه
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // ترجمه نوع گزارش به فارسی
  const getReportTypeText = (type: string) => {
    switch (type) {
      case "daily":
        return "روزانه"
      case "weekly":
        return "هفتگی"
      case "monthly":
        return "ماهانه"
      default:
        return type
    }
  }

  // ترجمه فرمت گزارش به فارسی
  const getReportFormatText = (format: string) => {
    switch (format) {
      case "pdf":
        return "PDF"
      case "excel":
        return "Excel"
      case "csv":
        return "CSV"
      default:
        return format
    }
  }

  // نمایش زمان اجرا به صورت خوانا
  const formatScheduleTime = (report: ScheduledReport) => {
    const { type, schedule } = report

    if (type === "daily") {
      return `هر روز ساعت ${schedule.hour}:${schedule.minute.toString().padStart(2, "0")}`
    } else if (type === "weekly") {
      const days = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"]
      return `هر ${days[schedule.day || 0]} ساعت ${schedule.hour}:${schedule.minute.toString().padStart(2, "0")}`
    } else if (type === "monthly") {
      return `روز ${schedule.day} هر ماه ساعت ${schedule.hour}:${schedule.minute.toString().padStart(2, "0")}`
    }

    return ""
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>گزارش‌های خودکار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>گزارش‌های خودکار</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            به‌روزرسانی
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                گزارش جدید
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ایجاد گزارش خودکار جدید</DialogTitle>
                <DialogDescription>
                  مشخصات گزارش خودکار را وارد کنید. این گزارش به صورت خودکار در زمان‌های مشخص شده اجرا خواهد شد.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">نام گزارش</Label>
                    <Input id="name" name="name" value={newReport.name} onChange={handleInputChange} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">توضیحات (اختیاری)</Label>
                    <Input
                      id="description"
                      name="description"
                      value={newReport.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">نوع گزارش</Label>
                    <Select value={newReport.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب نوع گزارش" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">روزانه</SelectItem>
                        <SelectItem value="weekly">هفتگی</SelectItem>
                        <SelectItem value="monthly">ماهانه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="format">فرمت گزارش</Label>
                    <Select value={newReport.format} onValueChange={(value) => handleSelectChange("format", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب فرمت گزارش" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="recipients">گیرندگان (با کاما جدا کنید)</Label>
                    <Input
                      id="recipients"
                      name="recipients"
                      value={newReport.recipients}
                      onChange={handleInputChange}
                      placeholder="example@example.com, example2@example.com"
                      required
                    />
                  </div>

                  {newReport.type !== "daily" && (
                    <div className="grid gap-2">
                      <Label htmlFor="day">{newReport.type === "weekly" ? "روز هفته" : "روز ماه"}</Label>
                      <Select value={newReport.day} onValueChange={(value) => handleSelectChange("day", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب روز" />
                        </SelectTrigger>
                        <SelectContent>
                          {newReport.type === "weekly" ? (
                            <>
                              <SelectItem value="0">یکشنبه</SelectItem>
                              <SelectItem value="1">دوشنبه</SelectItem>
                              <SelectItem value="2">سه‌شنبه</SelectItem>
                              <SelectItem value="3">چهارشنبه</SelectItem>
                              <SelectItem value="4">پنج‌شنبه</SelectItem>
                              <SelectItem value="5">جمعه</SelectItem>
                              <SelectItem value="6">شنبه</SelectItem>
                            </>
                          ) : (
                            Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hour">ساعت</Label>
                      <Select value={newReport.hour} onValueChange={(value) => handleSelectChange("hour", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب ساعت" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="minute">دقیقه</Label>
                      <Select value={newReport.minute} onValueChange={(value) => handleSelectChange("minute", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب دقیقه" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Switch id="isActive" checked={newReport.isActive} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="isActive">فعال</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">ایجاد گزارش</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">{error}</div>}

        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">{report.name}</h3>
                    <Badge variant={report.isActive ? "default" : "secondary"}>
                      {report.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => runReportNow(report.id)}>
                      <Download className="mr-1 h-3 w-3" />
                      اجرای فوری
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => toggleReportStatus(report.id, report.isActive)}>
                      {report.isActive ? (
                        <>
                          <BellOff className="mr-1 h-3 w-3" />
                          غیرفعال کردن
                        </>
                      ) : (
                        <>
                          <Bell className="mr-1 h-3 w-3" />
                          فعال کردن
                        </>
                      )}
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => deleteReport(report.id)}>
                      <Trash2 className="mr-1 h-3 w-3" />
                      حذف
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-2">{report.description || "بدون توضیحات"}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      نوع: {getReportTypeText(report.type)} - فرمت: {getReportFormatText(report.format)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatScheduleTime(report)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {report.lastRun ? (
                        <>آخرین اجرا: {new Date(report.lastRun).toLocaleString("fa-IR")}</>
                      ) : (
                        "هنوز اجرا نشده"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">هیچ گزارش خودکاری تعریف نشده است.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
