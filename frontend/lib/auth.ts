import { createClient } from "@/lib/supabase-server"

export async function auth() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
