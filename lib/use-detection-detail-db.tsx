"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "./supabase/client"
import type { Detection } from "./supabase/schema"
import type { SensorDataPoint } from "./use-detection-detail"
// Hook to provide detection detail data from the database
export function useDetectionDetailDb(id: string) {
  const [loading, setLoading] = useState(true)
  const [detection, setDetection] = useState<Detection | null>(null)
  const [sensorData, setSensorData] = useState<{
    powerUsage: SensorDataPoint[]
    noiseLevel: SensorDataPoint[]
    rfSignal: SensorDataPoint[]
    networkTraffic: SensorDataPoint[]
  }>({
    powerUsage: [],
    noiseLevel: [],
    rfSignal: [],
    networkTraffic: [],
  })
  const [timeline, setTimeline] = useState<any[]>([])
  const [relatedDetections, setRelatedDetections] = useState<Detection[]>([])
  const [error, setError] = useState<string | null>(null)
  // Fetch detection data
  useEffect(() => {
    const controller = new AbortController()
    async function fetchData() {
      try {
        setLoading(true)
        // Fetch detection
        const { data: initialDetectionData, error: initialDetectionError } = await supabaseClient
          .from("detections")
          .select("*")
          .eq("id", id)
          .single()
        // بررسی احراز هویت کاربر
        const { data: session } = await supabaseClient.auth.getSession()
        if (!session?.session) {
          setError("لطفا برای دسترسی به جزئیات تشخیص وارد سیستم شوید")
          setLoading(false)
          return
        }
        if (initialDetectionError) throw new Error(`Error fetching detection: ${initialDetectionError.message}`)
        // دریافت اطلاعات تشخیص با مکانیزم تلاش مجدد
        let retries = 0
        let detectionData = null
        let detectionError = null
        while (retries < 3 && !detectionData) {
          const result = await supabaseClient
            .from("detections")
            .select("*")
            .eq("id", id)
            .abortSignal(controller.signal)
            .single()
          detectionData = result.data
          detectionError = result.error
          if (detectionError && detectionError.code !== "PGRST301") {
            break
          } else if (!detectionData) {
            retries++
            await new Promise((resolve) => setTimeout(resolve, 1000 * retries))
          }
        }
        if (detectionError) {
          console.error("خطای دریافت اطلاعات تشخیص:", detectionError)
          throw new Error(`خطا در دریافت اطلاعات تشخیص: ${detectionError.message}`)
        }
        if (!detectionData) {
          throw new Error("تشخیص مورد نظر یافت نشد")
        }
        setDetection(detectionData as Detection)
        // Fetch sensor data
        const { data: sensorDataRaw, error: sensorError } = await supabaseClient
          .from("sensor_data")
          .select("*")
          .eq("detection_id", id)
          .order("timestamp", { ascending: true })
          .abortSignal(controller.signal)
        if (sensorError) throw new Error(`Error fetching sensor data: ${sensorError.message}`)
        if (sensorError) {
          console.error("Sensor data fetch error:", sensorError)
          throw new Error(`خطا در دریافت داده های سنسوری: ${sensorError.message}`)
        }
        // Transform sensor data
        // اعتبارسنجی داده‌های سنسور
        if (!sensorDataRaw || sensorDataRaw.length === 0) {
          console.warn("هیچ داده سنسوری برای تشخیص با شناسه یافت نشد:", id)
        }
        // تبدیل داده‌های سنسور با مدیریت خطا
        const powerData: SensorDataPoint[] = []
        const noiseData: SensorDataPoint[] = []
        const rfData: SensorDataPoint[] = []
        const networkData: SensorDataPoint[] = []
        sensorDataRaw?.forEach((item) => {
          try {
            if (!item.timestamp || isNaN(item.value)) {
              console.warn("داده سنسور نامعتبر:", item)
              return
            }
            const dataPoint: SensorDataPoint = {
              timestamp: new Date(item.timestamp).toLocaleTimeString("fa-IR"),
              value: item.value,
              unit: item.unit,
              notes: item.notes,
            }
            switch (item.data_type) {
              case "power":
                powerData.push(dataPoint)
                break
              case "noise":
                noiseData.push(dataPoint)
                break
              case "rf":
                rfData.push(dataPoint)
                break
              case "network":
                networkData.push(dataPoint)
                break
            }
          } catch (error) {
            console.error("Error processing sensor data:", error)
          }
        })
        setSensorData({
          powerUsage: powerData,
          noiseLevel: noiseData,
          rfSignal: rfData,
          networkTraffic: networkData,
        })
        // Fetch timeline events
        const { data: timelineData, error: timelineError } = await supabaseClient
          .from("timeline_events")
          .select("*, users(full_name)")
          .eq("detection_id", id)
          .order("timestamp", { ascending: false })
        if (timelineError) throw new Error(`Error fetching timeline: ${timelineError.message}`)
        // Transform timeline data
        const transformedTimeline = timelineData.map((event) => ({
          type: event.event_type,
          title: event.title,
          description: event.description,
          timestamp: new Date(event.timestamp).toLocaleString("fa-IR"),
          user: event.users?.full_name,
        }))
        setTimeline(transformedTimeline)
        // Fetch related detections
        const { data: relatedData, error: relatedError } = await supabaseClient
          .from("related_detections")
          .select("related_detection:related_detection_id(*)")
          .eq("detection_id", id)
        if (relatedError) throw new Error(`Error fetching related detections: ${relatedError.message}`)
        // Transform related detections
        const transformedRelated = relatedData.map((item) => item.related_detection as Detection)
        setRelatedDetections(transformedRelated)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id])
  // Function to update detection status
  const updateDetectionStatus = async (status: string) => {
    try {
      const { data, error } = await supabaseClient
        .from("detections")
        .update({
          status: status as any,
          last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
      if (error) throw new Error(`Error updating status: ${error.message}`)
      // Update local state
      setDetection((prev) => (prev ? { ...prev, status: status as any } : null))
      // Add timeline event
      const eventType = status === "تایید شده" ? "verification" : status === "رد شده" ? "rejection" : "update"
      await supabaseClient.from("timeline_events").insert({
        detection_id: id,
        event_type: eventType,
        title: `تغییر وضعیت به ${status}`,
        description: `وضعیت تشخیص به "${status}" تغییر یافت.`,
        timestamp: new Date().toISOString(),
      })
      // Refresh timeline
      const { data: timelineData } = await supabaseClient
        .from("timeline_events")
        .select("*, users(full_name)")
        .eq("detection_id", id)
        .order("timestamp", { ascending: false })
      const transformedTimeline = timelineData.map((event) => ({
        type: event.event_type,
        title: event.title,
        description: event.description,
        timestamp: new Date(event.timestamp).toLocaleString("fa-IR"),
        user: event.users?.full_name,
      }))
      setTimeline(transformedTimeline)
      return true
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    }
  }
  // Function to add a note
  const addNote = async (content: string) => {
    try {
      const { data, error } = await supabaseClient
        .from("notes")
        .insert({
          detection_id: id,
          content,
        })
        .select()
      if (error) throw new Error(`Error adding note: ${error.message}`)
      // Add timeline event
      await supabaseClient.from("timeline_events").insert({
        detection_id: id,
        event_type: "note",
        title: "یادداشت جدید",
        description: content.length > 50 ? content.substring(0, 50) + "..." : content,
        timestamp: new Date().toISOString(),
      })
      // Refresh timeline
      const { data: timelineData } = await supabaseClient
        .from("timeline_events")
        .select("*, users(full_name)")
        .eq("detection_id", id)
        .order("timestamp", { ascending: false })
      const transformedTimeline = timelineData.map((event) => ({
        type: event.event_type,
        title: event.title,
        description: event.description,
        timestamp: new Date(event.timestamp).toLocaleString("fa-IR"),
        user: event.users?.full_name,
      }))
      setTimeline(transformedTimeline)
      return true
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    }
  }
  return {
    loading,
    detection,
    sensorData,
    timeline,
    relatedDetections,
    error,
    updateDetectionStatus,
    addNote,
  }
}
