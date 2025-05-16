import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a server-side supabase client with cookies for auth
export function createServerClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "x-client-info": "@supabase/auth-helpers-nextjs",
      },
    },
  })
}
