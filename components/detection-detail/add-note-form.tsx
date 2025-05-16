"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useDetectionDetail } from "@/lib/use-detection-detail"

interface AddNoteFormProps {
  detectionId: string
}

export function AddNoteForm({ detectionId }: AddNoteFormProps) {
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { addNote } = useDetectionDetail(detectionId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!note.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً یک یادداشت وارد کنید.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const success = await addNote(note)
      if (success) {
        toast({
          title: "موفقیت",
          description: "یادداشت با موفقیت اضافه شد.",
        })
        setNote("")
      } else {
        toast({
          title: "خطا",
          description: "خطا در افزودن یادداشت",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding note:", error)
      toast({
        title: "خطا",
        description: "خطا در افزودن یادداشت",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="یادداشت خود را اینجا بنویسید..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "در حال ارسال..." : "ارسال یادداشت"}
      </Button>
    </form>
  )
}
