"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { toast } from "@/components/ui/use-toast"

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

// Define the WebSocket context type
interface WebSocketContextType {
  isConnected: boolean
  detections: Detection[]
  filteredDetections: Detection[]
  recentDetections: Detection[]
  stats: {
    total: number
    powerUsage: number
    noise: number
    network: number
    rf: number
  }
  lastUpdate: Date | null
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  clearFilters: () => void
  detectionMethods: string[]
  locations: string[]
  statuses: string[]
}

// Create the context with default values
const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  detections: [],
  filteredDetections: [],
  recentDetections: [],
  stats: {
    total: 0,
    powerUsage: 0,
    noise: 0,
    network: 0,
    rf: 0,
  },
  lastUpdate: null,
  filters: {
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
  },
  setFilters: () => {},
  clearFilters: () => {},
  detectionMethods: [],
  locations: [],
  statuses: [],
})

// Initial mock data
const initialDetections: Detection[] = [
  {
    id: "1",
    location: "تهران - منطقه 5",
    method: "مصرف برق",
    timestamp: "امروز، 10:25",
    status: "تایید شده",
    coordinates: { lat: 35.6892, lng: 51.389 },
    confidence: 0.85,
  },
  {
    id: "2",
    location: "اصفهان - خیابان چهارباغ",
    method: "نویز صوتی",
    timestamp: "امروز، 09:14",
    status: "در حال بررسی",
    coordinates: { lat: 32.6539, lng: 51.666 },
    confidence: 0.72,
  },
  {
    id: "3",
    location: "مشهد - بلوار وکیل آباد",
    method: "سیگنال RF",
    timestamp: "دیروز، 16:42",
    status: "تایید شده",
    coordinates: { lat: 36.2972, lng: 59.6067 },
    confidence: 0.91,
  },
  {
    id: "4",
    location: "شیراز - خیابان زند",
    method: "ترافیک شبکه",
    timestamp: "دیروز، 14:30",
    status: "رد شده",
    coordinates: { lat: 29.6104, lng: 52.5288 },
    confidence: 0.65,
  },
  {
    id: "5",
    location: "تبریز - خیابان ولیعصر",
    method: "مصرف برق",
    timestamp: "دیروز، 12:15",
    status: "تایید شده",
    coordinates: { lat: 38.0753, lng: 46.2919 },
    confidence: 0.88,
  },
  {
    id: "6",
    location: "اهواز - کیانپارس",
    method: "نویز صوتی",
    timestamp: "دیروز، 11:30",
    status: "در حال بررسی",
    coordinates: { lat: 31.3183, lng: 48.6706 },
    confidence: 0.69,
  },
  {
    id: "7",
    location: "کرج - مهرشهر",
    method: "سیگنال RF",
    timestamp: "دیروز، 10:45",
    status: "تایید شده",
    coordinates: { lat: 35.84, lng: 50.9391 },
    confidence: 0.82,
  },
  {
    id: "8",
    location: "قم - خیابان امام",
    method: "ترافیک شبکه",
    timestamp: "دیروز، 09:20",
    status: "رد شده",
    coordinates: { lat: 34.6416, lng: 50.8746 },
    confidence: 0.61,
  },
  {
    id: "9",
    location: "کرمانشاه - طاق بستان",
    method: "مصرف برق",
    timestamp: "دیروز، 08:10",
    status: "تایید شده",
    coordinates: { lat: 34.3953, lng: 47.0947 },
    confidence: 0.79,
  },
  {
    id: "10",
    location: "رشت - میدان شهرداری",
    method: "نویز صوتی",
    timestamp: "دیروز، 07:45",
    status: "در حال بررسی",
    coordinates: { lat: 37.2682, lng: 49.5891 },
    confidence: 0.74,
  },
]

// Initial stats based on mock data
const initialStats = {
  total: initialDetections.length,
  powerUsage: initialDetections.filter((d) => d.method === "مصرف برق").length,
  noise: initialDetections.filter((d) => d.method === "نویز صوتی").length,
  rf: initialDetections.filter((d) => d.method === "سیگنال RF").length,
  network: initialDetections.filter((d) => d.method === "ترافیک شبکه").length,
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

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [detections, setDetections] = useState<Detection[]>(initialDetections)
  const [filteredDetections, setFilteredDetections] = useState<Detection[]>(initialDetections)
  const [recentDetections, setRecentDetections] = useState<Detection[]>(initialDetections.slice(0, 4))
  const [stats, setStats] = useState(initialStats)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)

  // Extract unique values for filter options
  const detectionMethods = Array.from(new Set(detections.map((d) => d.method)))
  const locations = Array.from(new Set(detections.map((d) => d.location)))
  const statuses = Array.from(new Set(detections.map((d) => d.status)))

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mock locations for random detections
  const mockLocations = [
    { name: "تهران - منطقه 2", lat: 35.7545, lng: 51.3651 },
    { name: "تبریز - خیابان ولیعصر", lat: 38.0753, lng: 46.2919 },
    { name: "اهواز - کیانپارس", lat: 31.3183, lng: 48.6706 },
    { name: "کرج - مهرشهر", lat: 35.84, lng: 50.9391 },
    { name: "قم - خیابان امام", lat: 34.6416, lng: 50.8746 },
    { name: "کرمانشاه - طاق بستان", lat: 34.3953, lng: 47.0947 },
  ]

  // Mock detection methods
  const detectionMethodsList: DetectionMethod[] = ["مصرف برق", "نویز صوتی", "سیگنال RF", "ترافیک شبکه"]

  // Function to generate a random detection
  const generateRandomDetection = useCallback((): Detection => {
    const location = mockLocations[Math.floor(Math.random() * mockLocations.length)]
    const method = detectionMethodsList[Math.floor(Math.random() * detectionMethodsList.length)]
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")

    return {
      id: Date.now().toString(),
      location: location.name,
      method,
      timestamp: `امروز، ${hours}:${minutes}`,
      status: "در حال بررسی",
      coordinates: { lat: location.lat, lng: location.lng },
      confidence: 0.6 + Math.random() * 0.35,
      details: {
        powerUsage: method === "مصرف برق" ? 2000 + Math.random() * 1000 : undefined,
        noiseLevel: method === "نویز صوتی" ? 60 + Math.random() * 20 : undefined,
        rfSignalStrength: method === "سیگنال RF" ? 70 + Math.random() * 25 : undefined,
        networkTraffic: method === "ترافیک شبکه" ? 500 + Math.random() * 300 : undefined,
      },
    }
  }, [])

  // Function to simulate receiving a WebSocket message
  const simulateWebSocketMessage = useCallback(() => {
    if (isConnected) {
      const newDetection = generateRandomDetection()

      // Update detections list
      setDetections((prev) => [newDetection, ...prev])

      // Update recent detections
      setRecentDetections((prev) => [newDetection, ...prev].slice(0, 4))

      // Update stats
      setStats((prev) => ({
        total: prev.total + 1,
        powerUsage: prev.powerUsage + (newDetection.method === "مصرف برق" ? 1 : 0),
        noise: prev.noise + (newDetection.method === "نویز صوتی" ? 1 : 0),
        rf: prev.rf + (newDetection.method === "سیگنال RF" ? 1 : 0),
        network: prev.network + (newDetection.method === "ترافیک شبکه" ? 1 : 0),
      }))

      // Update last update time
      setLastUpdate(new Date())

      // Show toast notification
      toast({
        title: "تشخیص جدید",
        description: `${newDetection.method} در ${newDetection.location} شناسایی شد.`,
        variant: "default",
      })
    }
  }, [isConnected, generateRandomDetection])

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    // In a real implementation, you would connect to your WebSocket server
    // For this example, we'll simulate the connection
    console.log("Connecting to WebSocket server...")

    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      console.log("WebSocket connected")

      // Set up periodic updates to simulate incoming WebSocket messages
      const intervalId = setInterval(() => {
        // Randomly decide whether to send a new detection (30% chance)
        if (Math.random() < 0.3) {
          simulateWebSocketMessage()
        }
      }, 10000) // Every 10 seconds

      // Store the interval ID for cleanup
      return () => clearInterval(intervalId)
    }, 1500)
  }, [simulateWebSocketMessage])

  // Reconnect logic
  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log("Attempting to reconnect...")
      connectWebSocket()
    }, 3000) // Reconnect after 3 seconds
  }, [connectWebSocket])

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket()

    // Cleanup function
    return () => {
      setIsConnected(false)
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connectWebSocket])

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
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext)
