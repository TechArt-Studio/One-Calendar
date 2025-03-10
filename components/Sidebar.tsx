"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Plus, ChevronDown, X, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { translations } from "@/lib/i18n"
import { useCalendar, type CalendarCategory } from "@/contexts/CalendarContext"

interface SidebarProps {
  onCreateEvent: () => void
  onDateSelect: (date: Date) => void
  onViewChange?: (view: string) => void
  language?: Language
  selectedDate?: Date // 添加selectedDate属性
}

export type Language = "en" | "zh"

export default function Sidebar({
  onCreateEvent,
  onDateSelect,
  onViewChange,
  language = "zh",
  selectedDate,
}: SidebarProps) {
  // 使用 Context 中的日历分类数据
  const { calendars, addCategory: addCategoryToContext, removeCategory: removeCategoryFromContext } = useCalendar()

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("bg-blue-500")
  const [showAddCategory, setShowAddCategory] = useState(false)
  // 使用传入的selectedDate，如果没有则使用当前日期
  const [localSelectedDate, setLocalSelectedDate] = useState<Date | undefined>(selectedDate || new Date())
  const [manageCategoriesOpen, setManageCategoriesOpen] = useState(false)
  const t = translations[language || "zh"]

  // 当外部selectedDate变化时，更新本地状态
  if (selectedDate && (!localSelectedDate || selectedDate.getTime() !== localSelectedDate.getTime())) {
    setLocalSelectedDate(selectedDate)
  }

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: CalendarCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        color: newCategoryColor,
        keywords: [],
      }
      addCategoryToContext(newCategory)
      setNewCategoryName("")
      setNewCategoryColor("bg-blue-500")
      setShowAddCategory(false)
      toast({
        title: "分类已添加",
        description: `已成功添加"${newCategoryName}"分类`,
      })
    }
  }

  const removeCategory = (id: string) => {
    removeCategoryFromContext(id)
    toast({
      title: "分类已删除",
      description: "已成功删除分类",
    })
  }

  return (
    <div className="w-80 border-r bg-background overflow-y-auto">
      <div className="p-4">
        <Button
          className="w-full justify-start bg-[#0066FF] text-white hover:bg-[#0052CC] mb-4"
          onClick={onCreateEvent}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t.createEvent}
        </Button>

        <Button
          className="w-full justify-start bg-purple-600 text-white hover:bg-purple-700 mb-4"
          onClick={() => onViewChange && onViewChange("analytics")}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          {t.analytics || "分析与洞察"}
        </Button>

        <div className="mt-4">
          <Calendar
            mode="single"
            selected={localSelectedDate}
            onSelect={(date) => {
              setLocalSelectedDate(date)
              date && onDateSelect(date)
            }}
            className="rounded-md border"
          />
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.myCalendars}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          {calendars.map((calendar) => (
            <div key={calendar.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn("h-3 w-3 rounded-sm", calendar.color)} />
                <span className="text-sm">{calendar.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeCategory(calendar.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {showAddCategory ? (
            <div className="flex items-center space-x-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={t.categoryName || "新日历名称"}
                className="text-sm"
              />
              <Button size="sm" onClick={addCategory}>
                {t.addCategory || "添加"}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setManageCategoriesOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t.addNewCalendar}
            </Button>
          )}
        </div>
      </div>
      <Dialog open={manageCategoriesOpen} onOpenChange={setManageCategoriesOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.manageCategories}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">{t.categoryName}</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="输入分类名称"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.color}</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "blue-500",
                  "green-500",
                  "purple-500",
                  "yellow-500",
                  "red-500",
                  "pink-500",
                  "indigo-500",
                  "orange-500",
                  "teal-500",
                ].map((color) => (
                  <div
                    key={color}
                    className={cn(
                      `bg-${color} w-6 h-6 rounded-full cursor-pointer`,
                      newCategoryColor === `bg-${color}` ? "ring-2 ring-offset-2 ring-black" : "",
                    )}
                    onClick={() => setNewCategoryColor(`bg-${color}`)}
                  />
                ))}
              </div>
            </div>
            <Button onClick={addCategory} disabled={!newCategoryName}>
              <Plus className="mr-2 h-4 w-4" />
              {t.addCategory}
            </Button>
            <div className="space-y-2 mt-4">
              <Label>{t.existingCategories}</Label>
              <div className="space-y-2">
                {calendars.map((category) => (
                  <div key={category.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <div className={cn("w-4 h-4 rounded-full mr-2", category.color)} />
                      <span>{category.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeCategory(category.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setManageCategoriesOpen(false)}>{t.cancel || "关闭"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

