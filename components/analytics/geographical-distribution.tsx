"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { useAnalyticsData } from "@/lib/use-analytics-data"
import { useEffect, useRef } from "react"

export function GeographicalDistribution() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { geographicalData } = useAnalyticsData()
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapRef.current) {
      // This would be replaced with actual map implementation
      // using libraries like Leaflet or Google Maps
      const mockMapElement = document.createElement("div")
      mockMapElement.style.width = "100%"
      mockMapElement.style.height = "400px"
      mockMapElement.style.backgroundColor = isDark ? "#1e293b" : "#e5e7eb"
      mockMapElement.style.borderRadius = "0.5rem"
      mockMapElement.style.display = "flex"
      mockMapElement.style.alignItems = "center"
      mockMapElement.style.justifyContent = "center"
      mockMapElement.style.color = isDark ? "#94a3b8" : "#4b5563"
      mockMapElement.style.fontWeight = "bold"
      mockMapElement.style.position = "relative"
      mockMapElement.textContent = "نقشه توزیع جغرافیایی تشخیص‌ها"

      // Clear previous content
      while (mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild)
      }

      mapRef.current.appendChild(mockMapElement)

      // Add detection points
      geographicalData.forEach((city) => {
        // Calculate position based on coordinates
        // This is a simplified calculation for demonstration
        const x = ((city.lng - 45) / 15) * 80
        const y = ((38 - city.lat) / 8) * 80

        const marker = document.createElement("div")
        marker.style.position = "absolute"
        marker.style.width = "12px"
        marker.style.height = "12px"
        marker.style.backgroundColor = getMarkerColor(city.count)
        marker.style.borderRadius = "50%"
        marker.style.transform = "translate(-50%, -50%)"
        marker.style.left = `${Math.min(Math.max(x, 10), 90)}%`
        marker.style.top = `${Math.min(Math.max(y, 10), 90)}%`
        marker.style.cursor = "pointer"
        marker.style.boxShadow = "0 0 0 2px rgba(255, 255, 255, 0.5)"
        marker.title = `${city.name}: ${city.count} مورد`

        // Add a tooltip on hover
        marker.addEventListener("mouseenter", () => {
          const tooltip = document.createElement("div")
          tooltip.style.position = "absolute"
          tooltip.style.bottom = "calc(100% + 5px)"
          tooltip.style.left = "50%"
          tooltip.style.transform = "translateX(-50%)"
          tooltip.style.backgroundColor = isDark ? "#1e293b" : "white"
          tooltip.style.padding = "4px 8px"
          tooltip.style.borderRadius = "4px"
          tooltip.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
          tooltip.style.fontSize = "12px"
          tooltip.style.whiteSpace = "nowrap"
          tooltip.style.zIndex = "10"
          tooltip.style.color = isDark ? "#e2e8f0" : "#1e293b"
          tooltip.textContent = `${city.name}: ${city.count} مورد`
          marker.appendChild(tooltip)
        })

        marker.addEventListener("mouseleave", () => {
          const tooltip = marker.querySelector("div")
          if (tooltip) marker.removeChild(tooltip)
        })

        mockMapElement.appendChild(marker)
      })
    }
  }, [geographicalData, isDark])

  // Get marker color based on count
  const getMarkerColor = (count: number) => {
    if (count > 100) return "#ef4444" // red
    if (count > 50) return "#fb923c" // orange
    if (count > 20) return "#facc15" // yellow
    return "#4ade80" // green
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>توزیع جغرافیایی تشخیص‌ها</CardTitle>
        <CardDescription>پراکندگی موارد تشخیص در مناطق مختلف کشور</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-[400px] w-full rounded-md"></div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span className="text-sm">کم (۰-۲۰)</span>
          </div>
          <div className="flex items-center gap-2 mx-4">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-sm">متوسط (۲۱-۵۰)</span>
          </div>
          <div className="flex items-center gap-2 mx-4">
            <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
            <span className="text-sm">زیاد (۵۱-۱۰۰)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm">بسیار زیاد (۱۰۰+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
