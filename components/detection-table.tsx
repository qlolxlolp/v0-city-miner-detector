"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown, ChevronDown, ChevronUp, Eye } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"

type SortField = "timestamp" | "location" | "method" | "confidence" | "status"
type SortDirection = "asc" | "desc"

export function DetectionTable() {
  const { filteredDetections } = useWebSocket()
  const [sortField, setSortField] = useState<SortField>("timestamp")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Sort detections
  const sortedDetections = [...filteredDetections].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "timestamp":
        // Simple string comparison for demo purposes
        // In a real app, parse the timestamp properly
        comparison = a.timestamp.localeCompare(b.timestamp)
        break
      case "location":
        comparison = a.location.localeCompare(b.location)
        break
      case "method":
        comparison = a.method.localeCompare(b.method)
        break
      case "confidence":
        comparison = a.confidence - b.confidence
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Format confidence as percentage
  const formatConfidence = (value: number) => {
    return `${Math.round(value * 100)}%`
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "تایید شده":
        return "default"
      case "در حال بررسی":
        return "outline"
      case "رد شده":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Get method icon color
  const getMethodColor = (method: string) => {
    switch (method) {
      case "مصرف برق":
        return "text-amber-500"
      case "نویز صوتی":
        return "text-green-500"
      case "سیگنال RF":
        return "text-indigo-500"
      case "ترافیک شبکه":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("location")}
                className="hover:bg-transparent p-0 h-auto font-medium"
              >
                موقعیت
                {sortField === "location" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="mr-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("method")}
                className="hover:bg-transparent p-0 h-auto font-medium"
              >
                روش تشخیص
                {sortField === "method" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="mr-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("confidence")}
                className="hover:bg-transparent p-0 h-auto font-medium"
              >
                اطمینان
                {sortField === "confidence" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="mr-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("timestamp")}
                className="hover:bg-transparent p-0 h-auto font-medium"
              >
                زمان
                {sortField === "timestamp" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="mr-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="hover:bg-transparent p-0 h-auto font-medium"
              >
                وضعیت
                {sortField === "status" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="mr-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead className="w-[100px]">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDetections.length > 0 ? (
            sortedDetections.map((detection, index) => (
              <TableRow key={detection.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{detection.location}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center gap-1", getMethodColor(detection.method))}>
                    {detection.method}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-100 rounded-full">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          detection.confidence >= 0.8
                            ? "bg-green-500"
                            : detection.confidence >= 0.6
                              ? "bg-amber-500"
                              : "bg-red-500",
                        )}
                        style={{ width: `${detection.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs">{formatConfidence(detection.confidence)}</span>
                  </div>
                </TableCell>
                <TableCell>{detection.timestamp}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(detection.status)}>{detection.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/detections/${detection.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">مشاهده جزئیات</span>
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">باز کردن منو</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/detections/${detection.id}`}>مشاهده جزئیات</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>تغییر وضعیت</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>گزارش‌گیری</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                هیچ موردی یافت نشد.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
