"use client"

import type React from "react"
import { useEffect, useRef } from "react"

import { format, isSameDay, isWithinInterval, endOfDay, startOfDay } from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CalendarEvent } from "./Calendar"
import type { Language } from "@/lib/i18n"

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onTimeSlotClick: (date: Date) => void
  language: Language
  timezone: string
}

export default function DayView({ date, events, onEventClick, onTimeSlotClick, language, timezone }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const formatTime = (hour: number) => {
    // 使用24小时制格式化时间
    return `${hour.toString().padStart(2, "0")}:00`
  }

  const formatDateWithTimezone = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 使用24小时制
      timeZone: timezone,
    }
    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", options).format(date)
  }

  // 检查事件是否跨天
  const isMultiDayEvent = (start: Date, end: Date) => {
    return (
      start.getDate() !== end.getDate() ||
      start.getMonth() !== end.getMonth() ||
      start.getFullYear() !== end.getFullYear()
    )
  }

  // 计算事件在当天的开始和结束时间
  const getEventTimesForDay = (event: CalendarEvent, currentDate: Date) => {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    // 如果事件不在当天，返回null
    if (
      !isSameDay(start, currentDate) &&
      !isSameDay(end, currentDate) &&
      !isWithinInterval(currentDate, { start, end })
    ) {
      return null
    }

    // 如果是跨天事件
    if (isMultiDayEvent(start, end)) {
      // 如果当天是开始日期
      if (isSameDay(start, currentDate)) {
        return {
          start,
          end: endOfDay(currentDate),
          isPartial: true,
          position: "start",
        }
      }
      // 如果当天是结束日期
      else if (isSameDay(end, currentDate)) {
        return {
          start: startOfDay(currentDate),
          end,
          isPartial: true,
          position: "end",
        }
      }
      // 如果当天在事件中间
      else {
        return {
          start: startOfDay(currentDate),
          end: endOfDay(currentDate),
          isPartial: true,
          position: "middle",
        }
      }
    }

    // 如果不是跨天事件
    return { start, end, isPartial: false, position: "full" }
  }

  // 改进的事件布局算法，处理重叠事件
  const layoutEvents = (events: CalendarEvent[]) => {
    if (!events || events.length === 0) return []

    // 获取当天的事件时间
    const eventsWithTimes = events
      .map((event) => {
        const times = getEventTimesForDay(event, date)
        if (!times || !times.start || !times.end) return null
        return { event, ...times }
      })
      .filter(Boolean) as Array<{
      event: CalendarEvent
      start: Date
      end: Date
      isPartial: boolean
      position: string
    }>

    // 按开始时间排序
    eventsWithTimes.sort((a, b) => a.start.getTime() - b.start.getTime())

    // 创建时间段数组，每个时间段包含在该时间段内活跃的事件
    type TimePoint = { time: number; isStart: boolean; eventIndex: number }
    const timePoints: TimePoint[] = []

    // 添加所有事件的开始和结束时间点
    eventsWithTimes.forEach((eventWithTime, index) => {
      const startTime = eventWithTime.start.getTime()
      const endTime = eventWithTime.end.getTime()

      timePoints.push({ time: startTime, isStart: true, eventIndex: index })
      timePoints.push({ time: endTime, isStart: false, eventIndex: index })
    })

    // 按时间排序
    timePoints.sort((a, b) => {
      // 如果时间相同，结束时间点排在开始时间点之前
      if (a.time === b.time) {
        return a.isStart ? 1 : -1
      }
      return a.time - b.time
    })

    // 处理每个时间段
    const eventLayouts: Array<{
      event: CalendarEvent
      start: Date
      end: Date
      column: number
      totalColumns: number
      isPartial: boolean
      position: string
    }> = []

    // 当前活跃的事件
    const activeEvents = new Set<number>()
    // 事件到列的映射
    const eventToColumn = new Map<number, number>()

    for (let i = 0; i < timePoints.length; i++) {
      const point = timePoints[i]

      if (point.isStart) {
        // 事件开始
        activeEvents.add(point.eventIndex)

        // 找到可用的最小列号
        let column = 0
        const usedColumns = new Set<number>()

        // 收集当前已使用的列
        activeEvents.forEach((eventIndex) => {
          if (eventToColumn.has(eventIndex)) {
            usedColumns.add(eventToColumn.get(eventIndex)!)
          }
        })

        // 找到第一个未使用的列
        while (usedColumns.has(column)) {
          column++
        }

        // 分配列
        eventToColumn.set(point.eventIndex, column)
      } else {
        // 事件结束
        activeEvents.delete(point.eventIndex)
      }

      // 如果是最后一个时间点或下一个时间点与当前不同，处理当前时间段
      if (i === timePoints.length - 1 || timePoints[i + 1].time !== point.time) {
        // 计算当前活跃事件的布局
        const totalColumns =
          activeEvents.size > 0 ? Math.max(...Array.from(activeEvents).map((idx) => eventToColumn.get(idx)!)) + 1 : 0

        // 更新所有活跃事件的总列数
        activeEvents.forEach((eventIndex) => {
          const column = eventToColumn.get(eventIndex)!
          const { event, start, end, isPartial, position } = eventsWithTimes[eventIndex]

          // 检查是否已经添加过这个事件
          const existingLayout = eventLayouts.find((layout) => layout.event.id === event.id)

          if (!existingLayout) {
            eventLayouts.push({
              event,
              start,
              end,
              column,
              totalColumns: Math.max(totalColumns, 1),
              isPartial,
              position,
            })
          }
        })
      }
    }

    return eventLayouts
  }

  // 获取当天的事件布局
  const eventLayouts = layoutEvents(events)

  // 处理时间格子点击，根据点击位置确定更精确的时间
  const handleTimeSlotClick = (hour: number, event: React.MouseEvent<HTMLDivElement>) => {
    // 获取点击位置在时间格子内的相对位置
    const rect = event.currentTarget.getBoundingClientRect()
    const relativeY = event.clientY - rect.top
    const cellHeight = rect.height

    // 根据点击位置确定分钟数
    // 如果点击在格子的上半部分，分钟为0，否则为30
    const minutes = relativeY < cellHeight / 2 ? 0 : 30

    // 创建一个新的日期对象，设置为当前日期的指定小时和分钟
    const clickTime = new Date(date)
    clickTime.setHours(hour, minutes, 0, 0)

    // 调用传入的回调函数
    onTimeSlotClick(clickTime)
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 添加自动滚动到当前时间的效果
  useEffect(() => {
    // 使用setTimeout确保DOM已完全渲染
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const now = new Date()
        const currentHour = now.getHours()

        // 找到对应当前小时的DOM元素
        const hourElements = scrollContainerRef.current.querySelectorAll(".h-\\[60px\\]")
        if (hourElements.length > 0 && currentHour < hourElements.length) {
          // 获取当前小时的元素
          const currentHourElement = hourElements[currentHour + 1] // +1 是因为第一行是时间标签

          if (currentHourElement) {
            // 滚动到当前小时的位置，并向上偏移100px使其在视图中间偏上
            scrollContainerRef.current.scrollTo({
              top: (currentHourElement as HTMLElement).offsetTop - 100,
              behavior: "auto",
            })
          }
        }
      }
    }, 100) // 短暂延迟确保DOM已渲染

    return () => clearTimeout(timer)
  }, [date])

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[100px_1fr] border-b relative z-30 bg-background">
        <div className="py-2 text-center">
          <div className="text-sm text-muted-foreground">
            {format(date, "E", { locale: language === "zh" ? zhCN : enUS })}
          </div>
          <div className="text-3xl font-semibold text-blue-600">{format(date, "d")}</div>
        </div>
        <div className="p-2">{timezone}</div>
      </div>

      <div className="flex-1 grid grid-cols-[100px_1fr] overflow-auto" ref={scrollContainerRef}>
        <div className="text-sm text-muted-foreground">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] relative">
              {/* 修复时间标签位置，特别是0:00的显示问题 */}
              <span className="absolute top-0 right-4 -translate-y-1/2">{formatTime(hour)}</span>
            </div>
          ))}
        </div>

        <div className="relative border-l">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[60px] border-t border-gray-200"
              onClick={(e) => handleTimeSlotClick(hour, e)}
            />
          ))}

          {eventLayouts.map(({ event, start, end, column, totalColumns, isPartial, position }) => {
            const startMinutes = start.getHours() * 60 + start.getMinutes()
            const endMinutes = end.getHours() * 60 + end.getMinutes()
            const duration = endMinutes - startMinutes

            // 确保事件不会超出当天的时间范围
            const maxEndMinutes = 24 * 60 // 最大到午夜
            const displayDuration = Math.min(duration, maxEndMinutes - startMinutes)

            // 设置最小高度，确保短事件也能显示文本
            const minHeight = 20 // 最小高度为20px
            const height = Math.max(displayDuration, minHeight)

            let positionLabel = ""
            if (isPartial) {
              if (position === "start") {
                positionLabel = language === "zh" ? " (继续...)" : " (continues...)"
              } else if (position === "end") {
                positionLabel = language === "zh" ? " (...结束)" : " (...ends)"
              } else if (position === "middle") {
                positionLabel = language === "zh" ? " (...继续...)" : " (...continues...)"
              }
            }

            // 计算事件宽度和位置，处理重叠
            const width = `calc((100% - 8px) / ${totalColumns})`
            const left = `calc(${column} * ${width})`

            return (
              <div
                key={event.id}
                className={cn("absolute rounded-lg p-2 text-sm cursor-pointer overflow-hidden", event.color)}
                style={{
                  top: `${startMinutes}px`,
                  height: `${height}px`,
                  opacity: 0.9,
                  width,
                  left,
                  zIndex: column + 1, // 确保后面的事件在上层
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick(event)
                }}
              >
                <div className="font-medium text-white truncate">
                  {event.title}
                  {positionLabel}
                </div>
                {height >= 40 && ( // 只在高度足够时显示时间
                  <div className="text-xs text-white/90 truncate">
                    {formatDateWithTimezone(new Date(event.startDate))} -{" "}
                    {formatDateWithTimezone(new Date(event.endDate))}
                  </div>
                )}
              </div>
            )
          })}

          {(() => {
            // 获取当前本地时间
            const now = new Date()
            const currentHours = now.getHours()
            const currentMinutes = now.getMinutes()
            // 计算像素位置
            const topPosition = currentHours * 60 + currentMinutes

            return (
              <div
                className="absolute left-0 right-0 border-t-2 border-[#0066FF] z-10"
                style={{
                  top: `${topPosition}px`,
                }}
              />
            )
          })()}
        </div>
      </div>
    </div>
  )
}

