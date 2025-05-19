"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns-jalali"
import { fa } from "date-fns/locale"

interface TimeFilterProps {
  onFilterChange: (filter: {
    period: string
    startDate?: Date
    endDate?: Date
  }) => void
}

export function TimeFilter({ onFilterChange }: TimeFilterProps) {
  const [period, setPeriod] = useState("7days")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

  const handlePeriodChange = (value: string) => {
    setPeriod(value)

    // تنظیم خودکار تاریخ‌ها برای دوره‌های از پیش تعریف شده
    const today = new Date()
    let start: Date | undefined = undefined
    let end: Date | undefined = undefined

    if (value === "7days") {
      start = new Date(today)
      start.setDate(today.getDate() - 7)
      end = today
    } else if (value === "30days") {
      start = new Date(today)
      start.setDate(today.getDate() - 30)
      end = today
    } else if (value === "90days") {
      start = new Date(today)
      start.setDate(today.getDate() - 90)
      end = today
    } else if (value === "1year") {
      start = new Date(today)
      start.setFullYear(today.getFullYear() - 1)
      end = today
    } else if (value === "custom") {
      // برای دوره سفارشی تاریخ‌ها را تغییر نمی‌دهیم
      start = startDate
      end = endDate
    }

    setStartDate(start)
    setEndDate(end)

    onFilterChange({
      period: value,
      startDate: start,
      endDate: end,
    })
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    setIsStartDateOpen(false)

    if (date && period === "custom") {
      onFilterChange({
        period,
        startDate: date,
        endDate,
      })
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    setIsEndDateOpen(false)

    if (date && period === "custom") {
      onFilterChange({
        period,
        startDate,
        endDate: date,
      })
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-md shadow-sm">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">دوره زمانی</label>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger>
            <SelectValue placeholder="انتخاب دوره زمانی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">۷ روز گذشته</SelectItem>
            <SelectItem value="30days">۳۰ روز گذشته</SelectItem>
            <SelectItem value="90days">۹۰ روز گذشته</SelectItem>
            <SelectItem value="1year">۱ سال گذشته</SelectItem>
            <SelectItem value="custom">دوره سفارشی</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {period === "custom" && (
        <>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {startDate ? format(startDate, "yyyy/MM/dd", { locale: fa }) : "انتخاب تاریخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">تا تاریخ</label>
            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {endDate ? format(endDate, "yyyy/MM/dd", { locale: fa }) : "انتخاب تاریخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={handleEndDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  )
}
