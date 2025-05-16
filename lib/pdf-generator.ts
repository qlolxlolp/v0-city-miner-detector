import { jsPDF } from "jspdf"
import "jspdf-autotable"
import type { Detection, SensorData, TimelineEvent, Note, RelatedDetection } from "./supabase/schema"

// Add Persian font support
// Note: In a real implementation, you would need to include the font file
const addPersianFontSupport = (doc: jsPDF) => {
  // This is a placeholder - in a real app you would add proper font support
  // doc.addFont('path/to/persian-font.ttf', 'Persian', 'normal')
  return doc
}

export const generateDetectionPDF = async (
  detection: Detection,
  sensorData: Record<string, SensorData[]>,
  timelineEvents: TimelineEvent[],
  notes: Note[],
  relatedDetections: RelatedDetection[],
): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Add Persian font support
  addPersianFontSupport(doc)

  // Set RTL mode for Persian text
  doc.setR2L(true)

  // Add title
  doc.setFontSize(22)
  doc.text("گزارش تشخیص استخراج ارز دیجیتال", doc.internal.pageSize.width / 2, 20, { align: "center" })

  // Add detection ID and date
  doc.setFontSize(12)
  const dateStr = new Date(detection.timestamp).toLocaleDateString("fa-IR")
  doc.text(`شناسه تشخیص: ${detection.id}`, 20, 30)
  doc.text(`تاریخ: ${dateStr}`, 20, 35)

  // Add detection details
  doc.setFontSize(16)
  doc.text("اطلاعات تشخیص", doc.internal.pageSize.width / 2, 45, { align: "center" })

  // Create detection details table
  const detectionDetails = [
    ["موقعیت", detection.location],
    ["روش تشخیص", detection.method],
    ["وضعیت", detection.status],
    ["اطمینان", `${detection.confidence}%`],
    ["مختصات", `${detection.lat}, ${detection.lng}`],
    ["توان تخمینی", detection.estimated_power || "نامشخص"],
    ["تعداد دستگاه‌های تخمینی", detection.estimated_devices || "نامشخص"],
    ["زمان پردازش", detection.processing_time || "نامشخص"],
  ]

  // @ts-ignore - jspdf-autotable is not properly typed
  doc.autoTable({
    startY: 50,
    head: [["ویژگی", "مقدار"]],
    body: detectionDetails,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { font: "Persian", halign: "right" },
  })

  // Add sensor data section
  const currentY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(16)
  doc.text("داده‌های سنسور", doc.internal.pageSize.width / 2, currentY, { align: "center" })

  // Create sensor data tables for each type
  const sensorTypes = Object.keys(sensorData)
  let yPosition = currentY + 5

  for (const type of sensorTypes) {
    if (sensorData[type].length === 0) continue

    const typeName =
      type === "power" ? "مصرف برق" : type === "noise" ? "نویز صوتی" : type === "rf" ? "سیگنال RF" : "ترافیک شبکه"

    doc.setFontSize(14)
    yPosition += 10
    doc.text(`${typeName}`, 20, yPosition)

    const tableData = sensorData[type].map((reading) => [
      new Date(reading.timestamp).toLocaleTimeString("fa-IR"),
      reading.value.toString(),
      reading.unit || "",
    ])

    // @ts-ignore
    doc.autoTable({
      startY: yPosition + 5,
      head: [["زمان", "مقدار", "واحد"]],
      body: tableData.slice(0, 5), // Limit to 5 readings to save space
      theme: "grid",
      styles: { font: "Persian", halign: "right" },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 5

    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.height - 20) {
      doc.addPage()
      yPosition = 20
    }
  }

  // Add timeline section
  doc.addPage()
  doc.setFontSize(16)
  doc.text("تاریخچه رویدادها", doc.internal.pageSize.width / 2, 20, { align: "center" })

  if (timelineEvents.length > 0) {
    const timelineData = timelineEvents.map((event) => [
      new Date(event.timestamp).toLocaleString("fa-IR"),
      event.title,
      event.description,
    ])

    // @ts-ignore
    doc.autoTable({
      startY: 30,
      head: [["زمان", "عنوان", "توضیحات"]],
      body: timelineData,
      theme: "grid",
      styles: { font: "Persian", halign: "right" },
    })
  } else {
    doc.text("هیچ رویدادی ثبت نشده است.", 20, 30)
  }

  // Add notes section
  const notesY = (doc as any).lastAutoTable?.finalY + 10 || 50
  doc.setFontSize(16)
  doc.text("یادداشت‌ها", doc.internal.pageSize.width / 2, notesY, { align: "center" })

  if (notes.length > 0) {
    const notesData = notes.map((note) => [new Date(note.created_at).toLocaleString("fa-IR"), note.content])

    // @ts-ignore
    doc.autoTable({
      startY: notesY + 10,
      head: [["زمان", "متن یادداشت"]],
      body: notesData,
      theme: "grid",
      styles: { font: "Persian", halign: "right" },
    })
  } else {
    doc.text("هیچ یادداشتی ثبت نشده است.", 20, notesY + 10)
  }

  // Add related detections section
  doc.addPage()
  doc.setFontSize(16)
  doc.text("تشخیص‌های مرتبط", doc.internal.pageSize.width / 2, 20, { align: "center" })

  if (relatedDetections.length > 0) {
    const relatedData = relatedDetections.map((relation) => [
      relation.related_detection.id.toString(),
      relation.related_detection.location,
      relation.related_detection.method,
      new Date(relation.related_detection.timestamp).toLocaleString("fa-IR"),
      relation.relation_type === "same_location"
        ? "مکان مشابه"
        : relation.relation_type === "same_method"
          ? "روش مشابه"
          : "الگوی مشابه",
    ])

    // @ts-ignore
    doc.autoTable({
      startY: 30,
      head: [["شناسه", "موقعیت", "روش", "زمان", "نوع ارتباط"]],
      body: relatedData,
      theme: "grid",
      styles: { font: "Persian", halign: "right" },
    })
  } else {
    doc.text("هیچ تشخیص مرتبطی یافت نشد.", 20, 30)
  }

  // Add footer with generation time
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(
      `صفحه ${i} از ${pageCount} - تولید شده در ${new Date().toLocaleString("fa-IR")}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
  }

  // Return the PDF as a blob
  return doc.output("blob")
}
