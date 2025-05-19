"use client"

import { useState } from "react"
import { Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"
import { Badge } from "@/components/ui/badge"
import { DateTimeDisplay } from "@/components/date-time-display"

export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden">
      <MobileNav />

      <div className="flex-1 flex justify-center">
        <DateTimeDisplay className="text-sm" />
      </div>

      <div className="flex items-center gap-2">
        {searchOpen ? (
          <div className="absolute inset-0 z-50 flex h-14 w-full items-center gap-2 bg-background px-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSearchOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">بستن</span>
            </Button>
            <Input autoFocus placeholder="جستجو..." className="h-9 flex-1" />
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">جستجو</span>
          </Button>
        )}

        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 p-0 relative">
              <Bell className="h-5 w-5" />
              {hasNotifications && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />}
              <span className="sr-only">اعلان‌ها</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="font-semibold">اعلان‌ها</div>
                <Button variant="ghost" size="sm" onClick={() => setHasNotifications(false)}>
                  علامت‌گذاری همه به عنوان خوانده شده
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">تشخیص جدید</div>
                        <Badge>جدید</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        یک مورد مشکوک به استخراج ارز دیجیتال در منطقه تهرانپارس شناسایی شد.
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">۱۰ دقیقه پیش</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">هشدار سیستم</div>
                        <Badge variant="outline">خوانده شده</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">سنسور شماره ۵ نیاز به کالیبراسیون دارد.</p>
                      <div className="mt-2 text-xs text-muted-foreground">۲ ساعت پیش</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">گزارش هفتگی</div>
                        <Badge variant="outline">خوانده شده</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">گزارش هفتگی تشخیص‌ها آماده شده است.</p>
                      <div className="mt-2 text-xs text-muted-foreground">دیروز</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <Button variant="outline" className="w-full" onClick={() => setNotificationsOpen(false)}>
                  مشاهده همه اعلان‌ها
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
