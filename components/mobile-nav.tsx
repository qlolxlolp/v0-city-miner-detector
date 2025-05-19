"use client"

import { useState, useEffect } from "react"
import { Menu, X, Home, BarChart2, Map, FileText, Bell, Settings, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const routes = [
    {
      href: "/",
      label: "داشبورد",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      href: "/detections",
      label: "تشخیص‌ها",
      icon: <Map className="h-5 w-5" />,
      active: pathname === "/detections" || pathname.startsWith("/detections/"),
    },
    {
      href: "/analytics",
      label: "تحلیل‌ها",
      icon: <BarChart2 className="h-5 w-5" />,
      active: pathname === "/analytics",
    },
    {
      href: "/reports",
      label: "گزارش‌ها",
      icon: <FileText className="h-5 w-5" />,
      active: pathname === "/reports",
    },
    {
      href: "/alerts",
      label: "هشدارها",
      icon: <Bell className="h-5 w-5" />,
      active: pathname === "/alerts",
      badge: 3,
    },
    {
      href: "/settings",
      label: "تنظیمات",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">منوی اصلی</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] max-w-[320px] p-0">
          <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name || "کاربر"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "ک"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name || "کاربر سیستم"}</span>
                  <span className="text-xs text-muted-foreground">{user?.role || "مدیر سیستم"}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">بستن</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted transition-colors",
                    )}
                  >
                    {route.icon}
                    <span>{route.label}</span>
                    {route.badge && (
                      <span className="mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-medium text-primary">
                        {route.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 px-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="hardware" className="border-b-0">
                    <AccordionTrigger className="py-2 px-3 hover:bg-muted rounded-md text-sm">
                      وضعیت سخت‌افزارها
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-3">
                      <div className="space-y-1">
                        <Link
                          href="/hardware/sensors"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>سنسورها</span>
                          <span className="mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-[10px] font-medium text-green-600">
                            12
                          </span>
                        </Link>
                        <Link
                          href="/hardware/network"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>تجهیزات شبکه</span>
                          <span className="mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-medium text-amber-600">
                            5
                          </span>
                        </Link>
                        <Link
                          href="/hardware/power"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>سنسورهای برق</span>
                          <span className="mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-medium text-red-600">
                            3
                          </span>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="reports" className="border-b-0">
                    <AccordionTrigger className="py-2 px-3 hover:bg-muted rounded-md text-sm">
                      گزارش‌های خودکار
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-3">
                      <div className="space-y-1">
                        <Link
                          href="/reports/daily"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>گزارش روزانه</span>
                        </Link>
                        <Link
                          href="/reports/weekly"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>گزارش هفتگی</span>
                        </Link>
                        <Link
                          href="/reports/monthly"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>گزارش ماهانه</span>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="border-t p-4">
              <Button variant="outline" className="w-full" onClick={logout}>
                خروج از سیستم
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
