"use client"

import { useState } from "react"
import { CalendarIcon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns-jalali"

export function AnalyticsHeader() {
  const [date, setDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [timeRange, setTimeRange] = useState("30")

  // Handle predefined time range selection
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)

    const today = new Date()
    const startDate = new Date()

    switch (value) {
      case "7":
        startDate.setDate(today.getDate() - 7)
        break
      case "30":
        startDate.setDate(today.getDate() - 30)
        break
      case "90":
        startDate.setDate(today.getDate() - 90)
        break
      case "365":
        startDate.setDate(today.getDate() - 365)
        break
      case "custom":
        // Don't change dates for custom selection
        return
      default:
        startDate.setDate(today.getDate() - 30)
    }

    setDate(startDate)
    setEndDate(today)
  }

  // Handle export data
  const handleExport = () => {
    alert("صدور داده‌ها به اکسل")
    // In a real implementation, this would trigger a data export
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="انتخاب بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">۷ روز گذشته</SelectItem>
            <SelectItem value="30">۳۰ روز گذشته</SelectItem>
            <SelectItem value="90">۳ ماه گذشته</SelectItem>
            <SelectItem value="365">یک سال گذشته</SelectItem>
            <SelectItem value="custom">بازه زمانی دلخواه</SelectItem>
          </SelectContent>
        </Select>

        {timeRange === "custom" && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[180px] justify-start text-right font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {date ? format(date, "yyyy/MM/dd") : "تاریخ شروع"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[180px] justify-start text-right font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {endDate ? format(endDate, "yyyy/MM/dd") : "تاریخ پایان"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <Button variant="outline" className="gap-2" onClick={handleExport}>
        <Download className="h-4 w-4" />
        <span>صدور داده‌ها</span>
      </Button>
    </div>
  )
}
