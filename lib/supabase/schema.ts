import { createServerClient } from "./server"

// Types matching our database schema
export type DetectionMethod = "مصرف برق" | "نویز صوتی" | "سیگنال RF" | "ترافیک شبکه"
export type DetectionStatus = "تایید شده" | "در حال بررسی" | "رد شده"

export interface Detection {
  id: string
  location: string
  method: DetectionMethod
  timestamp: string
  status: DetectionStatus
  lat: number
  lng: number
  confidence: number
  sensor_id?: string
  estimated_power?: string
  estimated_devices?: string
  processing_time?: string
  last_updated?: string
  assigned_to?: string
  created_at?: string
  updated_at?: string
}

export interface SensorData {
  id: string
  detection_id: string
  data_type: "power" | "noise" | "rf" | "network"
  timestamp: string
  value: number
  unit?: string
  notes?: string
  created_at?: string
}

export interface TimelineEvent {
  id: string
  detection_id: string
  event_type: "detection" | "verification" | "rejection" | "update" | "assignment" | "note"
  title: string
  description: string
  timestamp: string
  user_id?: string
  created_at?: string
}

export interface Note {
  id: string
  detection_id: string
  user_id?: string
  content: string
  created_at?: string
}

export interface RelatedDetection {
  id: string
  detection_id: string
  related_detection_id: string
  relation_type: "same_location" | "same_method" | "pattern"
  created_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at?: string
  last_login?: string
}

// Function to initialize the database schema
export async function initializeSchema() {
  const supabase = createServerClient()

  // Create enum types for detection methods and statuses
  await supabase.rpc("create_type_if_not_exists", {
    type_name: "detection_method",
    enum_values: ["مصرف برق", "نویز صوتی", "سیگنال RF", "ترافیک شبکه"],
  })

  await supabase.rpc("create_type_if_not_exists", {
    type_name: "detection_status",
    enum_values: ["تایید شده", "در حال بررسی", "رد شده"],
  })

  // Create users table
  const { error: usersError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "users",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'operator',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_login TIMESTAMP WITH TIME ZONE
    `,
  })

  if (usersError) console.error("Error creating users table:", usersError)

  // Create detections table
  const { error: detectionsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "detections",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      location TEXT NOT NULL,
      method detection_method NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      status detection_status NOT NULL DEFAULT 'در حال بررسی',
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      confidence DOUBLE PRECISION NOT NULL,
      sensor_id TEXT,
      estimated_power TEXT,
      estimated_devices TEXT,
      processing_time TEXT,
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      assigned_to UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (detectionsError) console.error("Error creating detections table:", detectionsError)

  // Create sensor_data table
  const { error: sensorDataError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "sensor_data",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
      data_type TEXT NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
      value DOUBLE PRECISION NOT NULL,
      unit TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (sensorDataError) console.error("Error creating sensor_data table:", sensorDataError)

  // Create timeline_events table
  const { error: timelineEventsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "timeline_events",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (timelineEventsError) console.error("Error creating timeline_events table:", timelineEventsError)

  // Create related_detections table
  const { error: relatedDetectionsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "related_detections",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
      related_detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
      relation_type TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(detection_id, related_detection_id)
    `,
  })

  if (relatedDetectionsError) console.error("Error creating related_detections table:", relatedDetectionsError)

  // Create notes table
  const { error: notesError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "notes",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (notesError) console.error("Error creating notes table:", notesError)

  // Create indexes for performance
  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_detections_location",
    table_name: "detections",
    column_name: "location",
  })

  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_detections_method",
    table_name: "detections",
    column_name: "method",
  })

  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_detections_status",
    table_name: "detections",
    column_name: "status",
  })

  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_detections_timestamp",
    table_name: "detections",
    column_name: "timestamp",
  })

  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_sensor_data_detection_id",
    table_name: "sensor_data",
    column_name: "detection_id",
  })

  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_sensor_data_data_type",
    table_name: "sensor_data",
    column_name: "data_type",
  })

  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_timeline_events_detection_id",
    table_name: "timeline_events",
    column_name: "detection_id",
  })

  await supabase.rpc("create_index_if_not_exists", {
    index_name: "idx_notes_detection_id",
    table_name: "notes",
    column_name: "detection_id",
  })

  return { success: true }
}
