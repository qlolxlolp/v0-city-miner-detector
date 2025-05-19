"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useWebSocket } from "@/lib/websocket-provider"
import { supabaseClient } from "@/lib/supabase/client"

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { detections, refreshData } = useWebSocket()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<any[]>([])

  // دریافت داده‌های مکانی از پایگاه داده
  useEffect(() => {
    async function fetchGeoData() {
      try {
        setLoading(true)
        const { data, error } = await supabaseClient.from("detections").select("id, location, lat, lng, method, status")

        if (error) {
          console.error("خطا در دریافت داده‌های مکانی:", error)
          setError("خطا در دریافت داده‌های مکانی")
          return
        }

        if (data && mapRef.current) {
          // بررسی محیط مرورگر
          if (typeof window === "undefined") return

          // پاک کردن محتوای قبلی
          while (mapRef.current.firstChild) {
            mapRef.current.removeChild(mapRef.current.firstChild)
          }

          // تلاش برای استفاده از کتابخانه نقشه واقعی
          try {
            // بررسی وجود Leaflet
            if (window.L) {
              const mapElement = document.createElement("div")
              mapElement.style.width = "100%"
              mapElement.style.height = "100%"
              mapRef.current.appendChild(mapElement)

              const map = window.L.map(mapElement).setView([32.4279, 53.688], 5)

              window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              }).addTo(map)

              // اضافه کردن نقاط به نقشه
              markersRef.current = data.map((detection) => {
                const markerColor = getMarkerColor(detection.method, detection.status)
                return window.L.marker([detection.lat, detection.lng], {
                  icon: window.L.divIcon({
                    className: "custom-marker",
                    html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                  }),
                })
                  .addTo(map)
                  .bindPopup(
                    `<div dir="rtl">
                      <strong>${detection.location}</strong><br>
                      روش: ${detection.method}<br>
                      وضعیت: ${detection.status}<br>
                      <a href="/detections/${detection.id}" target="_blank">مشاهده جزئیات</a>
                    </div>`,
                  )
              })

              return
            }
          } catch (error) {
            console.warn("خطا در راه‌اندازی نقشه Leaflet:", error)
          }

          // استفاده از نقشه ساختگی اگر Leaflet در دسترس نباشد
          const mockMapElement = document.createElement("div")
          mockMapElement.style.width = "100%"
          mockMapElement.style.height = "100%"
          mockMapElement.style.backgroundColor = isDark ? "#1e293b" : "#e5e7eb"
          mockMapElement.style.borderRadius = "0.5rem"
          mockMapElement.style.display = "flex"
          mockMapElement.style.alignItems = "center"
          mockMapElement.style.justifyContent = "center"
          mockMapElement.style.color = isDark ? "#94a3b8" : "#4b5563"
          mockMapElement.style.fontWeight = "bold"
          mockMapElement.style.position = "relative"
          mockMapElement.textContent = "نقشه پراکندگی تشخیص‌ها"
          mapRef.current.appendChild(mockMapElement)

          // اضافه کردن نقاط به نقشه ساختگی
          data.forEach((detection) => {
            // محاسبه موقعیت بر اساس مختصات
            const x = ((detection.lng - 45) / 15) * 80
            const y = ((38 - detection.lat) / 8) * 80

            const marker = document.createElement("div")
            marker.style.position = "absolute"
            marker.style.width = "12px"
            marker.style.height = "12px"
            marker.style.backgroundColor = getMarkerColor(detection.method, detection.status)
            marker.style.borderRadius = "50%"
            marker.style.transform = "translate(-50%, -50%)"
            marker.style.left = `${Math.min(Math.max(x, 10), 90)}%`
            marker.style.top = `${Math.min(Math.max(y, 10), 90)}%`
            marker.style.cursor = "pointer"
            marker.style.boxShadow = "0 0 0 2px rgba(255, 255, 255, 0.5)"
            marker.title = `${detection.location}: ${detection.method}`

            // اضافه کردن tooltip هنگام hover
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
              tooltip.style.direction = "rtl"
              tooltip.innerHTML = `
                <strong>${detection.location}</strong><br>
                روش: ${detection.method}<br>
                وضعیت: ${detection.status}
              `
              marker.appendChild(tooltip)
            })

            marker.addEventListener("mouseleave", () => {
              const tooltip = marker.querySelector("div")
              if (tooltip) marker.removeChild(tooltip)
            })

            marker.addEventListener("click", () => {
              window.open(`/detections/${detection.id}`, "_blank")
            })

            mockMapElement.appendChild(marker)
          })
        }
      } catch (err) {
        console.error("خطا در دریافت داده‌های مکانی:", err)
        setError("خطا در دریافت داده‌های مکانی")
      } finally {
        setLoading(false)
      }
    }

    fetchGeoData()

    // تنظیم interval برای به‌روزرسانی خودکار نقشه هر 60 ثانیه
    const intervalId = setInterval(fetchGeoData, 60000)

    return () => clearInterval(intervalId)
  }, [isDark])

  // تابع تعیین رنگ نشانگر بر اساس روش و وضعیت
  const getMarkerColor = (method: string, status: string) => {
    if (status === "تایید شده") {
      switch (method) {
        case "مصرف برق":
          return "#ef4444" // red
        case "نویز صوتی":
          return "#22c55e" // green
        case "سیگنال RF":
          return "#6366f1" // indigo
        case "ترافیک شبکه":
          return "#3b82f6" // blue
        default:
          return "#9ca3af" // gray
      }
    } else if (status === "در حال بررسی") {
      return "#f59e0b" // amber
    } else {
      return "#9ca3af" // gray
    }
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button className="text-xs text-primary hover:underline" onClick={() => window.location.reload()}>
            تلاش مجدد
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="h-full w-full"></div>
    </div>
  )
}
