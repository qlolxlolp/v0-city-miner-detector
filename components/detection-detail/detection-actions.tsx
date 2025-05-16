"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, UserPlus } from "lucide-react"
import { ReportButton } from "./report-button"
import { AddNoteForm } from "./add-note-form"
import { useDetectionDetail } from "@/lib/use-detection-detail"

interface DetectionActionsProps {
  id: string
}

export function DetectionActions({ id }: DetectionActionsProps) {
  const { detection, updateStatus } = useDetectionDetail(id)

  if (!detection) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>اقدامات</CardTitle>
        <CardDescription>اقدامات مربوط به این تشخیص</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={detection.status === "تایید شده" ? "default" : "outline"}
            onClick={() => updateStatus("تایید شده")}
          >
            <CheckCircle className="ml-2 h-4 w-4" />
            تایید
          </Button>
          <Button
            variant={detection.status === "رد شده" ? "destructive" : "outline"}
            onClick={() => updateStatus("رد شده")}
          >
            <XCircle className="ml-2 h-4 w-4" />
            رد
          </Button>
        </div>

        <Button className="w-full" variant="outline">
          <UserPlus className="ml-2 h-4 w-4" />
          تخصیص به کاربر
        </Button>

        {/* Add the Report Button here */}
        <ReportButton detectionId={id} />

        <div className="pt-4">
          <h4 className="mb-2 font-medium">افزودن یادداشت</h4>
          <AddNoteForm detectionId={id} />
        </div>
      </CardContent>
    </Card>
  )
}
