import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Radio, Volume2, Wifi } from "lucide-react"

export function DetectionMethodsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>روش‌های شناسایی</CardTitle>
        <CardDescription>تکنیک‌های مورد استفاده برای کشف ماینرها</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4 rounded-md border p-4">
          <Zap className="h-5 w-5 text-amber-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">تحلیل مصرف برق</p>
            <p className="text-sm text-muted-foreground">شناسایی الگوهای مصرف غیرعادی</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-md border p-4">
          <Radio className="h-5 w-5 text-indigo-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">سیگنال‌های EMI/RF</p>
            <p className="text-sm text-muted-foreground">شناسایی امواج الکترومغناطیسی</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-md border p-4">
          <Volume2 className="h-5 w-5 text-green-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">تحلیل نویز صوتی</p>
            <p className="text-sm text-muted-foreground">شناسایی صدای فن‌های ماینر</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-md border p-4">
          <Wifi className="h-5 w-5 text-blue-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">تحلیل ترافیک شبکه</p>
            <p className="text-sm text-muted-foreground">شناسایی ارتباط با استخرهای استخراج</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
