"use client"

import { useState, useEffect } from "react"

export interface SensorDataPoint {
  timestamp: string
  value: number
  unit?: string
  notes?: string
}

export interface SensorData {
  powerUsage: SensorDataPoint[]
  noiseLevel: SensorDataPoint[]
  rfSignal: SensorDataPoint[]
  networkTraffic: SensorDataPoint[]
}

export interface TimelineEvent {
  type: string
  title: string
  description: string
  timestamp: string
  user?: string
}

export interface RelatedDetection {
  id: string
  location: string
  method: string
  timestamp: string
  status: string
  confidence: number
}

export function useDetectionDetail(id: string) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [detection, setDetection] = useState<any>(null)
  const [sensorData, setSensorData] = useState<SensorData>({
    powerUsage: [],
    noiseLevel: [],
    rfSignal: [],
    networkTraffic: [],
  })
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [relatedDetections, setRelatedDetections] = useState<RelatedDetection[]>([])

  useEffect(() => {
    async function fetchRealData() {
      try {
        setLoading(true)

        // Mock data for demonstration purposes
        const mockDetection = {
          id: id,
          location: "تهران - منطقه " + id,
          method: "مصرف برق",
          timestamp: "امروز، 14:30",
          status: "در حال بررسی",
          coordinates: { lat: 35.7 + Number(id) * 0.01, lng: 51.4 + Number(id) * 0.01 },
          confidence: 0.75 + Number(id) * 0.01,
          estimatedPower: "3.2",
          estimatedDevices: "2-3",
          processingTime: "2 دقیقه و 10 ثانیه",
          lastUpdated: "امروز، 14:35",
        }

        setDetection(mockDetection)

        const mockSensorData = {
          powerUsage: [
            { timestamp: "14:30:00", value: 2500, unit: "وات" },
            { timestamp: "14:30:10", value: 2550, unit: "وات" },
            { timestamp: "14:30:20", value: 2600, unit: "وات" },
          ],
          noiseLevel: [
            { timestamp: "14:30:00", value: 55, unit: "دسی‌بل" },
            { timestamp: "14:30:10", value: 56, unit: "دسی‌بل" },
            { timestamp: "14:30:20", value: 57, unit: "دسی‌بل" },
          ],
          rfSignal: [
            { timestamp: "14:30:00", value: -60, unit: "dBm" },
            { timestamp: "14:30:10", value: -59, unit: "dBm" },
            { timestamp: "14:30:20", value: -58, unit: "dBm" },
          ],
          networkTraffic: [
            { timestamp: "14:30:00", value: 150, unit: "Mbps" },
            { timestamp: "14:30:10", value: 155, unit: "Mbps" },
            { timestamp: "14:30:20", value: 160, unit: "Mbps" },
          ],
        }

        setSensorData(mockSensorData)

        const mockTimeline = [
          { type: "detection", title: "تشخیص اولیه", description: "تشخیص ماینر با مصرف برق", timestamp: "14:30" },
          {
            type: "verification",
            title: "تایید کارشناس",
            description: "تایید توسط کارشناس",
            timestamp: "14:35",
            user: "محمد احمدی",
          },
        ]

        setTimeline(mockTimeline)

        const mockRelatedDetections = [
          {
            id: "123",
            location: "تهران - منطقه 1",
            method: "نویز صوتی",
            timestamp: "دیروز، 10:00",
            status: "تایید شده",
            confidence: 0.8,
          },
          {
            id: "456",
            location: "تهران - منطقه 2",
            method: "ترافیک شبکه",
            timestamp: "دیروز، 11:00",
            status: "در حال بررسی",
            confidence: 0.6,
          },
        ]

        setRelatedDetections(mockRelatedDetections)
      } catch (err) {
        console.error("Error fetching detection details:", err)
        setError(err instanceof Error ? err.message : "خطا در دریافت جزئیات تشخیص")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRealData()
    }
  }, [id])

  // Function to update detection status
  const updateDetectionStatus = async (status: string) => {
    return true
  }

  // Function to add a note
  const addNote = async (content: string) => {
    return true
  }

  return {
    loading,
    error,
    detection,
    sensorData,
    timeline,
    relatedDetections,
    updateDetectionStatus,
    addNote,
  }
}
