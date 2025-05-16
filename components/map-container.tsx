"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWebSocket } from "@/lib/websocket-provider"
import { Badge } from "@/components/ui/badge"

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { detections } = useWebSocket()
  const [newMarkers, setNewMarkers] = useState<Set<string>>(new Set())

  useEffect(() => {
    // This would be replaced with actual map implementation
    // using libraries like Leaflet or Google Maps
    if (mapRef.current) {
      const mockMapElement = document.createElement("div")
      mockMapElement.style.width = "100%"
      mockMapElement.style.height = "400px"
      mockMapElement.style.backgroundColor = "#e5e7eb"
      mockMapElement.style.borderRadius = "0.5rem"
      mockMapElement.style.display = "flex"
      mockMapElement.style.alignItems = "center"
      mockMapElement.style.justifyContent = "center"
      mockMapElement.style.color = "#4b5563"
      mockMapElement.style.fontWeight = "bold"
      mockMapElement.style.position = "relative"
      mockMapElement.textContent = "نقشه موقعیت‌های شناسایی شده"

      // Clear previous content
      while (mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild)
      }

      mapRef.current.appendChild(mockMapElement)

      // Add detection points
      detections.forEach((detection, index) => {
        const isNew = newMarkers.has(detection.id)

        // Calculate position based on coordinates
        // This is a simplified calculation for demonstration
        const x = ((detection.coordinates.lng - 45) / 15) * 80
        const y = ((38 - detection.coordinates.lat) / 8) * 80

        const marker = document.createElement("div")
        marker.style.position = "absolute"
        marker.style.width = isNew ? "16px" : "12px"
        marker.style.height = isNew ? "16px" : "12px"
        marker.style.backgroundColor = isNew ? "#f59e0b" : "#ef4444"
        marker.style.borderRadius = "50%"
        marker.style.transform = "translate(-50%, -50%)"
        marker.style.left = `${Math.min(Math.max(x, 10), 90)}%`
        marker.style.top = `${Math.min(Math.max(y, 10), 90)}%`
        marker.style.cursor = "pointer"
        marker.style.transition = "all 0.3s ease"
        marker.style.boxShadow = isNew ? "0 0 0 4px rgba(245, 158, 11, 0.3)" : "none"
        marker.title = `${detection.location} - ${detection.method}`

        // Add a tooltip on hover
        marker.addEventListener("mouseenter", () => {
          const tooltip = document.createElement("div")
          tooltip.style.position = "absolute"
          tooltip.style.bottom = "calc(100% + 5px)"
          tooltip.style.left = "50%"
          tooltip.style.transform = "translateX(-50%)"
          tooltip.style.backgroundColor = "white"
          tooltip.style.padding = "4px 8px"
          tooltip.style.borderRadius = "4px"
          tooltip.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
          tooltip.style.fontSize = "12px"
          tooltip.style.whiteSpace = "nowrap"
          tooltip.style.zIndex = "10"
          tooltip.textContent = `${detection.location} - ${detection.method}`
          marker.appendChild(tooltip)
        })

        marker.addEventListener("mouseleave", () => {
          const tooltip = marker.querySelector("div")
          if (tooltip) marker.removeChild(tooltip)
        })

        mockMapElement.appendChild(marker)
      })
    }
  }, [detections, newMarkers])

  // Effect to highlight new markers
  useEffect(() => {
    if (detections.length > 0) {
      // Get the ID of the most recent detection
      const newId = detections[0].id

      // Add it to the highlighted set
      setNewMarkers((prev) => new Set([...prev, newId]))

      // Remove the highlight after 5 seconds
      const timer = setTimeout(() => {
        setNewMarkers((prev) => {
          const newSet = new Set([...prev])
          newSet.delete(newId)
          return newSet
        })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [detections])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>نقشه موقعیت‌های شناسایی شده</CardTitle>
            <CardDescription>نمایش مکان‌های مشکوک به استخراج رمزارز</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {detections.length} موقعیت
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-[400px] w-full rounded-md"></div>
      </CardContent>
    </Card>
  )
}
