import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// اتصال به پایگاه داده Neon
const sql = neon(process.env.NEON_NEON_DATABASE_URL!)
export const db = drizzle(sql)

// تابع اجرای کوئری خام
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}
