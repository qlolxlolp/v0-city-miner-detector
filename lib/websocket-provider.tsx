"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { toast } from "@/components/ui/use-toast"
import { supabaseClient } from "./supabase/client"

// Define the types for our detection data
export type DetectionMethod = "مصرف برق" | "نویز صوتی" | "سیگنال RF" | "ترافیک شبکه"
export type DetectionStatus = "تایید شده" | "در حال بررسی" | "رد شده"

export interface Detection {
  id: string
  location: string
  method: DetectionMethod
  timestamp: string
  status: DetectionStatus
  coordinates: {
    lat: number
    lng: number
  }
  confidence: number
  details?: {
    powerUsage?: number
    noiseLevel?: number
    rfSignalStrength?: number
    networkTraffic?: number
  }
}

// Define filter types
export interface FilterOptions {
  search: string
  methods: string[]
  locations: string[]
  statuses: string[]
  dateRange: {
    from: string
    to: string
  }
  confidenceRange: {
    min: number
    max: number
  }
}

export interface StatsData {
  total: number
  powerUsage: number
  noise: number
  network: number
  rf: number
}

// Define the WebSocket context type
interface WebSocketContextType {
  isConnected: boolean
  detections: Detection[]
  filteredDetections: Detection[]
  recentDetections: Detection[]
  stats: StatsData
  lastUpdate: Date | null
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  clearFilters: () => void
  detectionMethods: string[]
  locations: string[]
  statuses: string[]
  refreshData: () => Promise<void>
}

// Default filter options
const defaultFilters: FilterOptions = {
  search: "",
  methods: [],
  locations: [],
  statuses: [],
  dateRange: {
    from: "",
    to: "",
  },
  confidenceRange: {
    min: 0,
    max: 100,
  },
}

// Default stats
const defaultStats: StatsData = {
  total: 0,
  powerUsage: 0,
  noise: 0,
  network: 0,
  rf: 0,
}

// Create the context with default values
const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  detections: [],
  filteredDetections: [],
  recentDetections: [],
  stats: defaultStats,
  lastUpdate: null,
  filters: defaultFilters,
  setFilters: () => {},
  clearFilters: () => {},
  detectionMethods: [],
  locations: [],
  statuses: [],
  refreshData: async () => {},
})

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [detections, setDetections] = useState<Detection[]>([])
  const [filteredDetections, setFilteredDetections] = useState<Detection[]>([])
  const [recentDetections, setRecentDetections] = useState<Detection[]>([])
  const [stats, setStats] = useState<StatsData>(defaultStats)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)

  // Extract unique values for filter options
  const detectionMethods = Array.from(new Set(detections.map((d) => d.method)))
  const locations = Array.from(new Set(detections.map((d) => d.location)))
  const statuses = Array.from(new Set(detections.map((d) => d.status)))

  const subscriptionRef = useRef<any>(null)

  // Function to fetch detections from the database
  const fetchDetections = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient
        .from("detections")
        .select("*")
        .order("timestamp", { ascending: false })

      if (error) {
        console.error("Error fetching detections:", error)
        return
      }

      if (data) {
        // Transform data to match Detection interface
        const transformedData: Detection[] = data.map((item) => ({
          id: item.id,
          location: item.location,
          method: item.method as DetectionMethod,
          timestamp: new Date(item.timestamp).toLocaleString("fa-IR"),
          status: item.status as DetectionStatus,
          coordinates: { lat: item.lat, lng: item.lng },
          confidence: item.confidence,
          details: {
            powerUsage: item.method === "مصرف برق" ? Number.parseFloat(item.estimated_power) : undefined,
            noiseLevel: item.method === "نویز صوتی" ? Math.random() * 100 : undefined,
            rfSignalStrength: item.method === "سیگنال RF" ? Math.random() * 100 : undefined,
            networkTraffic: item.method === "ترافیک شبکه" ? Math.random() * 1000 : undefined,
          },
        }))

        setDetections(transformedData)
        setFilteredDetections(transformedData)
        setRecentDetections(transformedData.slice(0, 4))
        setLastUpdate(new Date())
      }
    } catch (err) {
      console.error("Error in fetchDetections:", err)
    }
  }, [])

  // Function to fetch stats from the database
  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.from("detection_stats").select("*").single()

      if (error) {
        console.error("Error fetching stats:", error)
        return
      }

      if (data) {
        setStats({
          total: data.total_count,
          powerUsage: data.power_usage_count,
          noise: data.noise_count,
          rf: data.rf_count,
          network: data.network_count,
        })
      }
    } catch (err) {
      console.error("Error in fetchStats:", err)
    }
  }, [])

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([fetchDetections(), fetchStats()])
  }, [fetchDetections, fetchStats])

  // Initialize data and set up real-time subscription
  useEffect(() => {
    // Initial data fetch
    refreshData()

    // Set up real-time subscription for new detections
    const subscription = supabaseClient
      .channel("detection-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "detections",
        },
        (payload) => {
          console.log("Real-time update received:", payload)
          refreshData()

          // Show notification for new detections
          if (payload.eventType === "INSERT") {
            const newDetection = payload.new as any
            toast({
              title: "تشخیص جدید",
              description: `${newDetection.method} در ${newDetection.location} شناسایی شد.`,
              variant: "default",
            })
          }
        },
      )
      .subscribe()

    subscriptionRef.current = subscription
    setIsConnected(true)

    // Set up interval for periodic updates (as a fallback)
    const intervalId = setInterval(refreshData, 30000)

    // Cleanup function
    return () => {
      clearInterval(intervalId)
      if (subscriptionRef.current) {
        supabaseClient.removeChannel(subscriptionRef.current)
      }
      setIsConnected(false)
    }
  }, [refreshData])

  // Apply filters to detections
  useEffect(() => {
    let result = [...detections]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (detection) =>
          detection.location.toLowerCase().includes(searchLower) || detection.id.toLowerCase().includes(searchLower),
      )
    }

    // Apply method filter
    if (filters.methods.length > 0) {
      result = result.filter((detection) => filters.methods.includes(detection.method))
    }

    // Apply location filter
    if (filters.locations.length > 0) {
      result = result.filter((detection) => filters.locations.includes(detection.location))
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      result = result.filter((detection) => filters.statuses.includes(detection.status))
    }

    // Apply confidence range filter
    result = result.filter(
      (detection) =>
        detection.confidence * 100 >= filters.confidenceRange.min &&
        detection.confidence * 100 <= filters.confidenceRange.max,
    )

    // Update filtered detections
    setFilteredDetections(result)
  }, [detections, filters])

  // Function to clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  // Context value
  const contextValue: WebSocketContextType = {
    isConnected,
    detections,
    filteredDetections,
    recentDetections,
    stats,
    lastUpdate,
    filters,
    setFilters,
    clearFilters,
    detectionMethods,
    locations,
    statuses,
    refreshData,
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext)
