"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import { MapPin, Users, Calendar, Bell, AlignLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import { translations } from "@/lib/i18n"

interface SharedEvent {
  id: string
  title: string
  startDate: string
  endDate: string
  isAllDay: boolean
  location?: string
  participants: string[]
  notification: number
  description?: string
  color: string
  calendarId: string
  sharedBy: string
}

export default function SharedEventPage() {
  const params = useParams()
  const { toast } = useToast()
  const [language] = useLanguage()
  const t = translations[language]
  const [event, setEvent] = useState<SharedEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSharedEvent = async () => {
      try {
        setLoading(true)
        const shareId = params.id

        if (!shareId) {
          setError("No share ID provided")
          return
        }

        const response = await fetch(`/api/share?id=${shareId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Shared event not found")
          } else {
            setError("Failed to load shared event")
          }
          return
        }

        const result = await response.json()

        if (!result.success || !result.data) {
          setError("Invalid share data")
          return
        }

        // Parse the shared event data
        let eventData
        try {
          if (typeof result.data === "object") {
            eventData = result.data
          } else {
            eventData = JSON.parse(result.data)
          }
          setEvent(eventData)
        } catch (parseError) {
          console.error("Error parsing shared event:", parseError)
          setError("Invalid event data format")
        }
      } catch (error) {
        console.error("Error fetching shared event:", error)
        setError("Failed to load shared event")
      } finally {
        setLoading(false)
      }
    }

    fetchSharedEvent()
  }, [params.id])

  const formatDateWithTimezone = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd HH:mm", { locale: language === "zh" ? zhCN : enUS })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || "Event not found"}</h1>
        <p className="text-gray-600">
          {language === "zh"
            ? "无法加载共享的日历事件。该链接可能已过期或无效。"
            : "Unable to load the shared calendar event. The link may be expired or invalid."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header with event color */}
        <div className={cn("h-2 w-full", event.color)}></div>

        {/* Event title and shared by info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">{event.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {language === "zh" ? "分享者：" : "Shared by: "}
            {event.sharedBy}
          </p>

          {/* Date and time */}
          <div className="flex items-start mb-4">
            <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
            <div>
              <p>
                {formatDateWithTimezone(event.startDate)} - {formatDateWithTimezone(event.endDate)}
              </p>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
              <div>
                <p>{event.location}</p>
              </div>
            </div>
          )}

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <div className="flex items-start mb-4">
              <Users className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
              <div>
                <p>{event.participants.join(", ")}</p>
              </div>
            </div>
          )}

          {/* Notification */}
          {event.notification > 0 && (
            <div className="flex items-start mb-4">
              <Bell className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
              <div>
                <p>
                  {language === "zh" ? `提前 ${event.notification} 分钟提醒` : `${event.notification} minutes before`}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="flex items-start mb-4">
              <AlignLeft className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
              <div>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

