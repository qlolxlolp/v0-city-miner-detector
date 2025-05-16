import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateDetectionPDF } from "@/lib/pdf-generator"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerClient()

    // Fetch detection
    const { data: detection, error: detectionError } = await supabase
      .from("detections")
      .select("*")
      .eq("id", id)
      .single()

    if (detectionError) {
      return NextResponse.json(
        { success: false, message: `Error fetching detection: ${detectionError.message}` },
        { status: 500 },
      )
    }

    // Fetch sensor data
    const { data: sensorData, error: sensorError } = await supabase
      .from("sensor_data")
      .select("*")
      .eq("detection_id", id)
      .order("timestamp", { ascending: true })

    if (sensorError) {
      return NextResponse.json(
        { success: false, message: `Error fetching sensor data: ${sensorError.message}` },
        { status: 500 },
      )
    }

    // Group sensor data by type
    const groupedSensorData: Record<string, any[]> = {
      power: [],
      noise: [],
      rf: [],
      network: [],
    }

    sensorData.forEach((item) => {
      if (groupedSensorData[item.data_type]) {
        groupedSensorData[item.data_type].push(item)
      }
    })

    // Fetch timeline events
    const { data: timelineEvents, error: timelineError } = await supabase
      .from("timeline_events")
      .select("*")
      .eq("detection_id", id)
      .order("timestamp", { ascending: false })

    if (timelineError) {
      return NextResponse.json(
        { success: false, message: `Error fetching timeline events: ${timelineError.message}` },
        { status: 500 },
      )
    }

    // Fetch notes
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("detection_id", id)
      .order("created_at", { ascending: false })

    if (notesError) {
      return NextResponse.json(
        { success: false, message: `Error fetching notes: ${notesError.message}` },
        { status: 500 },
      )
    }

    // Fetch related detections
    const { data: relatedDetections, error: relatedError } = await supabase
      .from("related_detections")
      .select("*, related_detection:related_detection_id(*)")
      .eq("detection_id", id)

    if (relatedError) {
      return NextResponse.json(
        { success: false, message: `Error fetching related detections: ${relatedError.message}` },
        { status: 500 },
      )
    }

    // Generate PDF
    const pdfBlob = await generateDetectionPDF(detection, groupedSensorData, timelineEvents, notes, relatedDetections)

    // Convert blob to ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer()

    // Return PDF as response
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="detection-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ success: false, message: "Error generating PDF report" }, { status: 500 })
  }
}
