"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useWebSocket } from "@/lib/websocket-provider"

export function FilterBar() {
  const { setFilters, filters, clearFilters, detectionMethods, locations, statuses } = useWebSocket()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Count active filters for the badge
  useEffect(() => {
    let count = 0
    if (filters.search) count++
    if (filters.methods.length > 0) count++
    if (filters.locations.length > 0) count++
    if (filters.statuses.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.confidenceRange.min > 0 || filters.confidenceRange.max < 100) count++

    setActiveFiltersCount(count)
  }, [filters])

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // Debounce search to avoid too many updates
    const timer = setTimeout(() => {
      setFilters({ ...filters, search: value })
    }, 300)

    return () => clearTimeout(timer)
  }

  // Handle method filter changes
  const handleMethodChange = (method: string, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        methods: [...filters.methods, method],
      })
    } else {
      setFilters({
        ...filters,
        methods: filters.methods.filter((m) => m !== method),
      })
    }
  }

  // Handle location filter changes
  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        locations: [...filters.locations, location],
      })
    } else {
      setFilters({
        ...filters,
        locations: filters.locations.filter((l) => l !== location),
      })
    }
  }

  // Handle status filter changes
  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        statuses: [...filters.statuses, status],
      })
    } else {
      setFilters({
        ...filters,
        statuses: filters.statuses.filter((s) => s !== status),
      })
    }
  }

  // Handle confidence range changes
  const handleConfidenceChange = (type: "min" | "max", value: number) => {
    setFilters({
      ...filters,
      confidenceRange: {
        ...filters.confidenceRange,
        [type]: value,
      },
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="جستجو بر اساس موقعیت یا شناسه..."
          value={searchTerm}
          onChange={handleSearch}
          className="pr-9 w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Method Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>روش تشخیص</span>
              {filters.methods.length > 0 && (
                <Badge variant="secondary" className="mr-1 px-1 min-w-4 h-4 text-[10px]">
                  {filters.methods.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">روش تشخیص</h4>
              <div className="space-y-2">
                {detectionMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`method-${method}`}
                      checked={filters.methods.includes(method)}
                      onCheckedChange={(checked) => handleMethodChange(method, checked as boolean)}
                    />
                    <Label htmlFor={`method-${method}`} className="text-sm cursor-pointer">
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <span>موقعیت</span>
              {filters.locations.length > 0 && (
                <Badge variant="secondary" className="mr-1 px-1 min-w-4 h-4 text-[10px]">
                  {filters.locations.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">موقعیت</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                    />
                    <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <span>وضعیت</span>
              {filters.statuses.length > 0 && (
                <Badge variant="secondary" className="mr-1 px-1 min-w-4 h-4 text-[10px]">
                  {filters.statuses.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">وضعیت</h4>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.statuses.includes(status)}
                      onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                    />
                    <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Confidence Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <span>اطمینان</span>
              {(filters.confidenceRange.min > 0 || filters.confidenceRange.max < 100) && (
                <Badge variant="secondary" className="mr-1 px-1 min-w-4 h-4 text-[10px]">
                  ✓
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="end">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">میزان اطمینان (%)</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="confidence-min" className="text-xs">
                      حداقل
                    </Label>
                    <Input
                      id="confidence-min"
                      type="number"
                      min="0"
                      max="100"
                      value={filters.confidenceRange.min}
                      onChange={(e) => handleConfidenceChange("min", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confidence-max" className="text-xs">
                      حداکثر
                    </Label>
                    <Input
                      id="confidence-max"
                      type="number"
                      min="0"
                      max="100"
                      value={filters.confidenceRange.max}
                      onChange={(e) => handleConfidenceChange("max", Number.parseInt(e.target.value) || 100)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${filters.confidenceRange.max - filters.confidenceRange.min}%`,
                      marginRight: `${filters.confidenceRange.min}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
            <X className="h-3.5 w-3.5 mr-1" />
            پاک کردن
            <Badge variant="secondary" className="mr-1 px-1 min-w-4 h-4 text-[10px]">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  )
}
