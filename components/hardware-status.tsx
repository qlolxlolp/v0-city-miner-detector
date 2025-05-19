"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, Wifi, WifiOff, HardDrive, Radio, Thermometer, Download } from "lucide-react"
import { RealDataService } from "@/lib/real-data-service"

interface HardwareDevice {
  id: number
  name: string
  type: string
  model: string
  serialNumber: string
  firmwareVersion: string
  location: string
  ipAddress: string
  macAddress: string
  isConnected: boolean
  lastSeen: string
  lastChecked: string
  status: string
  configuration: any
}

export function HardwareStatus() {
  const [devices, setDevices] = useState<HardwareDevice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchHardwareStatus()

    // به‌روزرسانی خودکار هر ۳۰ ثانیه
    const interval = setInterval(fetchHardwareStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchHardwareStatus = async () => {
    try {
      setIsRefreshing(true)
      const data = await RealDataService.getHardwareConnectionStatus()
      setDevices(data.devices)
      setError(null)
    } catch (error) {
      console.error("خطا در دریافت وضعیت سخت‌افزارها:", error)
      setError("خطا در دریافت وضعیت سخت‌افزارها. لطفاً دوباره تلاش کنید.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchHardwareStatus()
  }

  const handleInstallDriver = async (deviceId: number) => {
    try {
      // در یک محیط واقعی، این تابع باید با سیستم عامل ارتباط برقرار کند
      // و درایور مورد نیاز را نصب کند

      // برای مثال، می‌توان از یک API سیستمی استفاده کرد
      const response = await fetch(`/api/hardware/install-driver/${deviceId}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("خطا در نصب درایور")
      }

      // به‌روزرسانی لیست دستگاه‌ها
      fetchHardwareStatus()
    } catch (error) {
      console.error("خطا در نصب درایور:", error)
      setError("خطا در نصب درایور. لطفاً دوباره تلاش کنید.")
    }
  }

  // فیلتر دستگاه‌ها بر اساس تب فعال
  const filteredDevices = devices.filter((device) => {
    if (activeTab === "all") return true
    if (activeTab === "connected") return device.isConnected
    if (activeTab === "disconnected") return !device.isConnected
    if (activeTab === "sensors") return device.type === "sensor"
    if (activeTab === "scanners") return device.type === "scanner"
    if (activeTab === "routers") return device.type === "router"
    return true
  })

  // دریافت آیکون مناسب برای هر نوع دستگاه
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "sensor":
        return <Thermometer className="h-5 w-5" />
      case "scanner":
        return <HardDrive className="h-5 w-5" />
      case "router":
        return <Radio className="h-5 w-5" />
      default:
        return <HardDrive className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>وضعیت اتصال سخت‌افزارها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>وضعیت اتصال سخت‌افزارها</CardTitle>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          به‌روزرسانی
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="connected">متصل</TabsTrigger>
            <TabsTrigger value="disconnected">قطع</TabsTrigger>
            <TabsTrigger value="sensors">سنسورها</TabsTrigger>
            <TabsTrigger value="scanners">اسکنرها</TabsTrigger>
            <TabsTrigger value="routers">روترها</TabsTrigger>
            <TabsTrigger value="other">سایر</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
              <div
                key={device.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <div className="bg-slate-100 p-2 rounded-full">{getDeviceIcon(device.type)}</div>
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {device.model} - {device.serialNumber}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  <Badge variant={device.isConnected ? "default" : "destructive"}>
                    {device.isConnected ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
                    {device.isConnected ? "متصل" : "قطع"}
                  </Badge>

                  <div className="text-xs text-muted-foreground">
                    آخرین بررسی: {new Date(device.lastChecked).toLocaleTimeString("fa-IR")}
                  </div>

                  {!device.isConnected && (
                    <Button variant="outline" size="sm" onClick={() => handleInstallDriver(device.id)}>
                      <Download className="mr-1 h-3 w-3" />
                      نصب درایور
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">هیچ دستگاهی یافت نشد.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
