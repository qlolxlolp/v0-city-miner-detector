"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { SensorData } from "@/lib/use-detection-detail"

interface SensorDataTableProps {
  sensorData: SensorData
  method: string
}

export function SensorDataTable({ sensorData, method }: SensorDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Determine which data to show based on the detection method
  const getData = () => {
    switch (method) {
      case "مصرف برق":
        return sensorData.powerUsage
      case "نویز صوتی":
        return sensorData.noiseLevel
      case "سیگنال RF":
        return sensorData.rfSignal
      case "ترافیک شبکه":
        return sensorData.networkTraffic
      default:
        // If method doesn't match, show all data combined
        return [
          ...sensorData.powerUsage,
          ...sensorData.noiseLevel,
          ...sensorData.rfSignal,
          ...sensorData.networkTraffic,
        ]
    }
  }

  const data = getData()

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return (
      item.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toString().includes(searchTerm) ||
      (item.unit && item.unit.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Handle export data
  const handleExport = () => {
    toast({
      title: "صدور داده‌ها",
      description: "داده‌های سنسور با موفقیت به فرمت CSV صادر شد.",
    })
    // In a real app, this would trigger a CSV download
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجو در داده‌های سنسور..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-9 w-full"
          />
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          <span>صدور CSV</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">زمان</TableHead>
              <TableHead>مقدار</TableHead>
              <TableHead>واحد</TableHead>
              <TableHead className="hidden md:table-cell">توضیحات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.timestamp}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.notes || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  هیچ داده‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
