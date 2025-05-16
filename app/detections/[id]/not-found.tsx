import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full">
          <AlertTriangle className="h-12 w-12 text-amber-600 dark:text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold">تشخیص یافت نشد</h1>
        <p className="text-muted-foreground max-w-md">
          تشخیص مورد نظر شما یافت نشد. ممکن است این تشخیص حذف شده باشد یا شناسه وارد شده اشتباه باشد.
        </p>
        <Link href="/detections">
          <Button>بازگشت به لیست تشخیص‌ها</Button>
        </Link>
      </div>
    </div>
  )
}
