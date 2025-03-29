"use client"

import { useState } from "react"
import { User, Upload, Download, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { backupData, restoreData, validatePassword } from "@/lib/backup-utils"
import { useCalendarContext } from "@/contexts/CalendarContext"
import { translations, useLanguage } from "@/lib/i18n"

export default function UserProfileButton() {
  const [language] = useLanguage()
  const t = translations[language]
  const { events, categories, setEvents, setCategories } = useCalendarContext()

  const [isBackupOpen, setIsBackupOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 从localStorage获取联系人和笔记数据
  const getLocalData = () => {
    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")
    return { contacts, notes }
  }

  // 将数据保存到localStorage
  const saveLocalData = (data: { contacts: any[]; notes: any[] }) => {
    localStorage.setItem("contacts", JSON.stringify(data.contacts))
    localStorage.setItem("notes", JSON.stringify(data.notes))
  }

  // 处理备份
  const handleBackup = async () => {
    // 验证密码
    if (!validatePassword(password)) {
      setPasswordError(
        language === "zh"
          ? "密码必须至少包含8个字符，包括大小写字母、数字和特殊字符"
          : "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters",
      )
      return
    }

    // 确认密码
    if (password !== confirmPassword) {
      setPasswordError(language === "zh" ? "两次输入的密码不匹配" : "Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // 获取所有数据
      const { contacts, notes } = getLocalData()
      const data = {
        events,
        categories,
        contacts,
        notes,
        timestamp: new Date().toISOString(),
      }

      // 备份数据
      const result = await backupData(password, data)

      if (result.success) {
        toast({
          title: language === "zh" ? "备份成功" : "Backup Successful",
          description:
            language === "zh"
              ? "您的数据已成功备份。请保存您的密码，以便将来恢复数据。"
              : "Your data has been backed up successfully. Please save your password for future restoration.",
        })
        setIsBackupOpen(false)
      } else {
        toast({
          variant: "destructive",
          title: language === "zh" ? "备份失败" : "Backup Failed",
          description: result.error || (language === "zh" ? "未知错误" : "Unknown error"),
        })
      }
    } catch (error) {
      console.error("Backup error:", error)
      toast({
        variant: "destructive",
        title: language === "zh" ? "备份失败" : "Backup Failed",
        description: error instanceof Error ? error.message : language === "zh" ? "未知错误" : "Unknown error",
      })
    } finally {
      setIsLoading(false)
      setPassword("")
      setConfirmPassword("")
      setPasswordError("")
    }
  }

  // 处理恢复
  const handleRestore = async () => {
    if (!password) {
      setPasswordError(language === "zh" ? "请输入密码" : "Please enter a password")
      return
    }

    setIsLoading(true)

    try {
      // 恢复数据
      const result = await restoreData(password)

      if (result.success && result.data) {
        // 更新日程和分类
        setEvents(result.data.events || [])
        setCategories(result.data.categories || [])

        // 更新联系人和笔记
        saveLocalData({
          contacts: result.data.contacts || [],
          notes: result.data.notes || [],
        })

        toast({
          title: language === "zh" ? "恢复成功" : "Restore Successful",
          description: language === "zh" ? "您的数据已成功恢复。" : "Your data has been restored successfully.",
        })
        setIsRestoreOpen(false)
      } else {
        toast({
          variant: "destructive",
          title: language === "zh" ? "恢复失败" : "Restore Failed",
          description: result.error || (language === "zh" ? "未找到备份数据" : "Backup not found"),
        })
      }
    } catch (error) {
      console.error("Restore error:", error)
      toast({
        variant: "destructive",
        title: language === "zh" ? "恢复失败" : "Restore Failed",
        description: error instanceof Error ? error.message : language === "zh" ? "未知错误" : "Unknown error",
      })
    } finally {
      setIsLoading(false)
      setPassword("")
      setPasswordError("")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">{language === "zh" ? "用户资料" : "User Profile"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsBackupOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            {language === "zh" ? "备份数据" : "Backup Data"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRestoreOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            {language === "zh" ? "导入数据" : "Restore Data"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 备份对话框 */}
      <Dialog open={isBackupOpen} onOpenChange={setIsBackupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "zh" ? "备份数据" : "Backup Data"}</DialogTitle>
            <DialogDescription>
              {language === "zh"
                ? "请创建一个强密码来保护您的数据。您将需要此密码来恢复数据。"
                : "Please create a strong password to protect your data. You will need this password to restore your data."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="password">{language === "zh" ? "密码" : "Password"}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === "zh" ? "输入密码" : "Enter password"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{language === "zh" ? "确认密码" : "Confirm Password"}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={language === "zh" ? "确认密码" : "Confirm password"}
              />
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            <p className="text-sm text-muted-foreground">
              {language === "zh"
                ? "密码必须至少包含8个字符，包括大小写字母、数字和特殊字符。"
                : "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackupOpen(false)} disabled={isLoading}>
              <X className="mr-2 h-4 w-4" />
              {language === "zh" ? "取消" : "Cancel"}
            </Button>
            <Button onClick={handleBackup} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {language === "zh" ? "处理中..." : "Processing..."}
                </span>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {language === "zh" ? "备份" : "Backup"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 恢复对话框 */}
      <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "zh" ? "导入数据" : "Restore Data"}</DialogTitle>
            <DialogDescription>
              {language === "zh"
                ? "请输入您之前用于备份数据的密码。"
                : "Please enter the password you used to backup your data."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="restorePassword">{language === "zh" ? "密码" : "Password"}</Label>
              <Input
                id="restorePassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === "zh" ? "输入备份密码" : "Enter backup password"}
              />
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            <p className="text-sm text-muted-foreground">
              {language === "zh"
                ? "警告：恢复数据将覆盖您当前的所有数据。此操作无法撤销。"
                : "Warning: Restoring data will overwrite all your current data. This action cannot be undone."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreOpen(false)} disabled={isLoading}>
              <X className="mr-2 h-4 w-4" />
              {language === "zh" ? "取消" : "Cancel"}
            </Button>
            <Button onClick={handleRestore} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {language === "zh" ? "处理中..." : "Processing..."}
                </span>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {language === "zh" ? "导入" : "Restore"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

