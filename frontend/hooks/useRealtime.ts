import { useEffect } from "react"
import { createClient } from "@/lib/supabase"

type Payload = any

export function useRealtime(
  channelName: string,
  event: string,
  schema: string = "public",
  table: string = "*",
  callback: (payload: Payload) => void
) {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes" as any,
        {
          event: event,
          schema: schema,
          table: table,
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName, event, schema, table, callback, supabase])
}
