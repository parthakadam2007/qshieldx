import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

const scanFrequencyOptions = [
  "continuous",
  "every-4-hours",
  "every-12-hours",
  "daily-midnight",
]

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "global")
      .single()

    const scanFrequency =
      settings?.value?.scanFrequency &&
      scanFrequencyOptions.includes(settings.value.scanFrequency)
        ? settings.value.scanFrequency
        : "every-4-hours"

    return NextResponse.json({ scanFrequency })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json()
    const scanFrequency = payload?.scanFrequency

    if (!scanFrequencyOptions.includes(scanFrequency)) {
      return NextResponse.json(
        { error: "Invalid scanFrequency value" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    await supabase
      .from("settings")
      .upsert({
        key: "global",
        value: { scanFrequency },
        updated_at: new Date().toISOString(),
      })

    return NextResponse.json({ success: true, scanFrequency })
  } catch (error) {
    console.error("Failed to save settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
