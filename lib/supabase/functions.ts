import { createServerClient } from "./server"
import { supabaseClient } from "./client"
import type { Detection, SensorData, TimelineEvent, Note, RelatedDetection, User } from "./schema"

// Detection functions
export async function getDetections() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("detections").select("*").order("timestamp", { ascending: false })

  if (error) {
    console.error("Error fetching detections:", error)
    return []
  }

  return data as Detection[]
}

export async function getDetectionById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("detections").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching detection with id ${id}:`, error)
    return null
  }

  return data as Detection
}

export async function updateDetectionStatus(id: string, status: string) {
  const supabase = supabaseClient
  const { data, error } = await supabase
    .from("detections")
    .update({
      status,
      last_updated: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating detection status for id ${id}:`, error)
    return null
  }

  return data[0] as Detection
}

export async function assignDetection(id: string, userId: string) {
  const supabase = supabaseClient
  const { data, error } = await supabase
    .from("detections")
    .update({
      assigned_to: userId,
      last_updated: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error assigning detection ${id} to user ${userId}:`, error)
    return null
  }

  return data[0] as Detection
}

// Sensor data functions
export async function getSensorDataByDetectionId(detectionId: string, dataType?: string) {
  const supabase = createServerClient()
  let query = supabase
    .from("sensor_data")
    .select("*")
    .eq("detection_id", detectionId)
    .order("timestamp", { ascending: true })

  if (dataType) {
    query = query.eq("data_type", dataType)
  }

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching sensor data for detection ${detectionId}:`, error)
    return []
  }

  return data as SensorData[]
}

export async function addSensorData(sensorData: Omit<SensorData, "id" | "created_at">) {
  const supabase = supabaseClient
  const { data, error } = await supabase.from("sensor_data").insert(sensorData).select()

  if (error) {
    console.error("Error adding sensor data:", error)
    return null
  }

  return data[0] as SensorData
}

// Timeline events functions
export async function getTimelineByDetectionId(detectionId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*, users(full_name)")
    .eq("detection_id", detectionId)
    .order("timestamp", { ascending: false })

  if (error) {
    console.error(`Error fetching timeline for detection ${detectionId}:`, error)
    return []
  }

  return data as (TimelineEvent & { users: { full_name: string } })[]
}

export async function addTimelineEvent(event: Omit<TimelineEvent, "id" | "created_at">) {
  const supabase = supabaseClient
  const { data, error } = await supabase.from("timeline_events").insert(event).select()

  if (error) {
    console.error("Error adding timeline event:", error)
    return null
  }

  return data[0] as TimelineEvent
}

// Notes functions
export async function getNotesByDetectionId(detectionId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("notes")
    .select("*, users(full_name)")
    .eq("detection_id", detectionId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching notes for detection ${detectionId}:`, error)
    return []
  }

  return data as (Note & { users: { full_name: string } })[]
}

export async function addNote(note: Omit<Note, "id" | "created_at">) {
  const supabase = supabaseClient
  const { data, error } = await supabase.from("notes").insert(note).select()

  if (error) {
    console.error("Error adding note:", error)
    return null
  }

  return data[0] as Note
}

// Related detections functions
export async function getRelatedDetections(detectionId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("related_detections")
    .select("*, related_detection:related_detection_id(id, location, method, timestamp, status, confidence)")
    .eq("detection_id", detectionId)

  if (error) {
    console.error(`Error fetching related detections for ${detectionId}:`, error)
    return []
  }

  return data.map((item) => ({
    ...item,
    related_detection: item.related_detection as Detection,
  }))
}

export async function addRelatedDetection(relation: Omit<RelatedDetection, "id" | "created_at">) {
  const supabase = supabaseClient
  const { data, error } = await supabase.from("related_detections").insert(relation).select()

  if (error) {
    console.error("Error adding related detection:", error)
    return null
  }

  return data[0] as RelatedDetection
}

// User functions
export async function getUsers() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("users").select("*").order("full_name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data as User[]
}

export async function getUserById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching user with id ${id}:`, error)
    return null
  }

  return data as User
}
