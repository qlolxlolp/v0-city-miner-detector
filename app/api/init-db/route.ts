import { NextResponse } from "next/server"
import { initializeSchema } from "@/lib/supabase/schema"

export async function GET() {
  try {
    const result = await initializeSchema()
    return NextResponse.json({ success: true, message: "Database schema initialized successfully" })
  } catch (error) {
    console.error("Error initializing database schema:", error)
    return NextResponse.json(
      { success: false, message: "Failed to initialize database schema", error },
      { status: 500 },
    )
  }
}
