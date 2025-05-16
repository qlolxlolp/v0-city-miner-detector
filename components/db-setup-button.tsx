"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Database } from "lucide-react"

export function DbSetupButton() {
  const [isInitializing, setIsInitializing] = useState(false)

  const handleInitDb = async () => {
    try {
      setIsInitializing(true)
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "موفقیت",
          description: "ساختار پایگاه داده با موفقیت ایجاد شد.",
        })
      } else {
        toast({
          title: "خطا",
          description: data.message || "خطا در ایجاد ساختار پایگاه داده",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      toast({
        title: "خطا",
        description: "خطا در ایجاد ساختار پایگاه داده",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button variant="outline" onClick={handleInitDb} disabled={isInitializing} className="gap-2">
        <Database className="h-4 w-4" />
        <span>ایجاد ساختار پایگاه داده</span>
      </Button>
    </div>
  )
}
