import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useUser } from "./useUser"

export function useScanJobs() {
  const { user } = useUser()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    const fetchJobs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("scan_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setJobs(data)
      }
      setLoading(false)
    }

    fetchJobs()

    // Realtime updates for scan jobs
    const channel = supabase
      .channel("scan-jobs-updates")
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "scan_jobs",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            setJobs((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setJobs((prev) =>
              prev.map((job) => (job.id === payload.new.id ? payload.new : job))
            )
          } else if (payload.eventType === "DELETE") {
            setJobs((prev) => prev.filter((job) => job.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  return { jobs, loading }
}
