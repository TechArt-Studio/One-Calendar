"use client"

import { useEffect, useState } from "react"

export type Language = "en" | "zh"

export const translations = {
  en: {
    calendar: "Calendar",
    createEvent: "Create Event",
    myCalendars: "My Calendars",
    addNewCalendar: "Add New Calendar",
    day: "Day",
    week: "Week",
    month: "Month",
    searchEvents: "Search events",
    title: "Title",
    startTime: "Start Time",
    endTime: "End Time",
    endTimeError: "End time must be after start time",
    allDay: "All Day",
    location: "Location",
    participants: "Participants",
    participantsPlaceholder: "Enter email addresses separated by commas",
    description: "Description",
    color: "Color",
    notification: "Notification",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    update: "Update",
    minutesBefore: "{minutes} minutes before",
    hourBefore: "{hours} hour before",
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    settings: "Settings",
    language: "Language",
    firstDayOfWeek: "First Day of Week",
    timezone: "Timezone",
    selectCalendar: "Select calendar",
    selectColor: "Select color",
    selectNotification: "Select notification time",
    atEventTime: "At event time",
    customTime: "Custom time",
    customTimeMinutes: "Minutes before event",
    eventAt: "Event at",
    view: "View",
    notificationSound: "Notification Sound",
    telegramSound: "Telegram",
    telegramSfxSound: "Telegram SFX",
    // Analytics translations
    analytics: "Analytics",
    timeAnalytics: "Time Analytics",
    timeDistribution: "Time Distribution",
    categoryTime: "Category Time (Hours)",
    totalEvents: "Total Events",
    mostProductiveDay: "Most Productive Day",
    mostProductiveHour: "Most Productive Hour",
    noData: "No data",
    week: "Week",
    month: "Month",
    year: "Year",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    manageCategories: "Manage Categories",
    categoryName: "Category Name",
    keywords: "Keywords",
    addKeyword: "Add Keyword",
    addCategory: "Add Category",
    existingCategories: "Existing Categories",
    importExport: "Import & Export",
    importCalendar: "Import Calendar",
    exportCalendar: "Export Calendar",
    fileImport: "File Import",
    urlImport: "URL Import",
    selectCalendarFile: "Select Calendar File",
    calendarUrl: "Calendar URL",
    supportedFormats: "Supported formats: .ics (iCalendar), .json and .csv",
    enterUrl: "Enter URL to .ics or .json file",
    debugMode: "Enable Debug Mode",
    debugInfo: "Debug Info",
    importing: "Importing...",
    import: "Import",
    exportFormat: "Export Format",
    dateRange: "Date Range",
    allEvents: "All Events",
    futureEvents: "Future Events",
    pastEvents: "Past Events",
    last30Days: "Last 30 Days",
    last90Days: "Last 90 Days",
    includeCompleted: "Include Completed Events",
    exporting: "Exporting...",
    export: "Export",
    importSuccess: "Successfully imported {count} events",
    exportSuccess: "Successfully exported {count} events",
    importWarning: "No events could be parsed from the file, please check the format",
    importError: "Error importing calendar data: {error}",
    exportError: "Error exporting calendar data",
    googleCalendarGuide: "Google Calendar Import Guide",
    googleCalendarGuideText:
      "When importing from Google Calendar, first select 'Settings > Import & Export > Export' in Google Calendar, download the .ics file and import it here. Do not use the 'Get Public URL' option as that is for sharing, not exporting.",
    iCalendarFormat: "iCalendar Format",
    backupData: "Backup Your Data",
    crossPlatformSync: "Cross-Platform Sync",
    iCalendarFormatDesc: "Standard format compatible with Google Calendar, Outlook, and Apple Calendar.",
    backupDataDesc: "Export your calendar data as a backup to ensure you don't lose important events.",
    crossPlatformSyncDesc:
      "Sync your calendar data across different devices and applications to maintain consistent scheduling.",
    importExportTips: "Import & Export Tips",
    tip1: "Exported iCalendar (.ics) files can be directly imported into most calendar applications",
    tip2: "CSV format is suitable for data exchange with spreadsheet applications",
    tip3: "JSON format contains the most complete event data, suitable for backup",
    tip4: "Importing a large number of events may take some time, please be patient",
    tip5: "Regularly exporting your calendar data as a backup is a good habit",
    dateAndTime: "Date and Time",
    copy: "Copy",
    eventDuplicated: "Event duplicated",
    welcomeToOneCalendar: "Welcome to One Calendar",
    powerfulCalendarApp:
      "This is a powerful calendar application that helps you manage your schedule, analyze time usage, get smart scheduling suggestions, and track your mood.",
    basicFeatures: "Basic Features",
    timeAnalyticsFeatures: "Time Analytics",
    scheduleSuggestionsFeatures: "Smart Suggestions",
    moodTrackerFeatures: "Mood Tracking",
    createEventGuide: "Create Events",
    createEventDesc:
      "Click the 'Create Event' button at the top of the sidebar, or directly click on a time slot in the calendar to create a new event.",
    switchViewGuide: "Switch Views",
    switchViewDesc:
      "Use the dropdown menu in the top navigation bar to switch between day, week, month, and analytics views.",
    manageCalendarCategoriesGuide: "Manage Calendar Categories",
    manageCalendarCategoriesDesc:
      "In the 'My Calendars' section of the sidebar, you can add, edit, and delete different calendar categories.",
    setReminderGuide: "Set Reminders",
    setReminderDesc:
      "When creating or editing an event, you can set a reminder time, and the system will notify you before the event starts.",
    howToAccessTimeAnalytics: "How to Use Time Analytics",
    timeAnalyticsDesc:
      "Click the 'Analytics & Insights' button in the sidebar, or select 'Analytics' in the view selector in the top navigation bar.",
    howToUseSmartSchedule: "How to Use Smart Schedule Suggestions",
    smartScheduleDesc:
      "In the analytics view, you can find the smart schedule suggestion feature. It recommends the best meeting times based on your preferences and existing schedule.",
    howToUseMoodTracker: "How to Use Mood Tracking",
    moodTrackerDesc:
      "In the analytics view, you can find the mood tracking feature. It allows you to record your daily mood and associate it with calendar events.",
    moodTrackerFeaturesList:
      "Main features: Record daily mood and notes, associate mood with calendar events, view mood trend charts, analyze the impact of different activities on your mood.",
    getStarted: "Get Started",
    nextStep: "Next",
    previousStep: "Previous",
    startUsing: "Start Using",
    keyFeatures: "Key Features",
    timeDistributionFeature: "View time distribution charts",
    productivityAnalysisFeature: "Analyze productive periods and dates",
    customCategoriesFeature: "Create custom time categories",
    timeUsageTrendsFeature: "View time usage trends",
    preferenceSettingFeature: "Set workday and time preferences",
    meetingDurationFeature: "Adjust meeting duration and buffer time",
    intelligentSuggestionsFeature: "Get intelligently sorted time suggestions",
    quickEventCreationFeature: "Create events directly from suggestions",
    dailyMoodRecordingFeature: "Record daily mood and notes",
    eventAssociationFeature: "Associate mood with calendar events",
    moodTrendAnalysisFeature: "View mood trend charts",
    activityImpactFeature: "Analyze activity impact on mood",
  },
  zh: {
    // Keep existing Chinese translations
    calendar: "日历",
    createEvent: "创建日程",
    myCalendars: "我的日历",
    addNewCalendar: "添加新日历",
    day: "日",
    week: "周",
    month: "月",
    searchEvents: "搜索日程",
    title: "标题",
    startTime: "开始时间",
    endTime: "结束时间",
    endTimeError: "结束时间必须晚于开始时间",
    allDay: "全天",
    location: "地点",
    participants: "参与者",
    participantsPlaceholder: "输入邮箱地址，用逗号分隔",
    description: "描述",
    color: "颜色",
    notification: "提醒",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    update: "更新",
    minutesBefore: "提前{minutes}分钟",
    hourBefore: "提前{hours}小时",
    sunday: "星期日",
    monday: "星期一",
    tuesday: "星期二",
    wednesday: "星期三",
    thursday: "星期四",
    friday: "星期五",
    saturday: "星期六",
    settings: "设置",
    language: "语言",
    firstDayOfWeek: "每周第一天",
    timezone: "时区",
    selectCalendar: "选择日历",
    selectColor: "选择颜色",
    selectNotification: "选择提醒时间",
    atEventTime: "事件开始时",
    customTime: "自定义时间",
    customTimeMinutes: "提前分钟数",
    eventAt: "事件时间",
    view: "查看",
    notificationSound: "通知声音",
    telegramSound: "Telegram",
    telegramSfxSound: "Telegram SFX",
    // Analytics translations
    analytics: "分析",
    timeAnalytics: "时间分析",
    timeDistribution: "时间分布",
    categoryTime: "分类时间（小时）",
    totalEvents: "总事件数",
    mostProductiveDay: "最高效的一天",
    mostProductiveHour: "最高效的时段",
    noData: "无数据",
    week: "周",
    month: "月",
    year: "年",
    thisWeek: "本周",
    thisMonth: "本月",
    thisYear: "本年",
    manageCategories: "管理分类",
    categoryName: "分类名称",
    keywords: "关键词",
    addKeyword: "添加关键词",
    addCategory: "添加分类",
    existingCategories: "现有分类",
    importExport: "导入与导出",
    importCalendar: "导入日历",
    exportCalendar: "导出日历",
    fileImport: "文件导入",
    urlImport: "URL导入",
    selectCalendarFile: "选择日历文件",
    calendarUrl: "日历URL",
    supportedFormats: "支持 .ics (iCalendar), .json 和 .csv 文件格式",
    enterUrl: "输入指向 .ics 或 .json 文件的URL",
    debugMode: "启用调试模式",
    debugInfo: "调试信息",
    importing: "导入中...",
    import: "导入",
    exportFormat: "导出格式",
    dateRange: "日期范围",
    allEvents: "所有事件",
    futureEvents: "未来事件",
    pastEvents: "过去事件",
    last30Days: "最近30天",
    last90Days: "最近90天",
    includeCompleted: "包含已完成的事件",
    exporting: "导出中...",
    export: "导出",
    importSuccess: "成功导入 {count} 个事件",
    exportSuccess: "成功导出 {count} 个事件",
    importWarning: "未能从文件中解析出任何事件，请检查文件格式是否正确",
    importError: "导入日历数据时出错: {error}",
    exportError: "导出日历数据时出错",
    googleCalendarGuide: "Google日历导入指南",
    googleCalendarGuideText:
      '从Google日历导入时，请先在Google日历中选择"设置 > 导入和导出 > 导出"，下载.ics文件后在此处导入。不要使用"获取公共URL"选项，因为那是用于共享而非导出的。',
    iCalendarFormat: "iCalendar格式",
    backupData: "备份您的数据",
    crossPlatformSync: "跨平台同步",
    iCalendarFormatDesc: "支持与Google日历、Outlook和Apple日历等应用程序兼容的标准格式。",
    backupDataDesc: "导出您的日历数据作为备份，确保不会丢失重要事件。",
    crossPlatformSyncDesc: "在不同设备和应用之间同步您的日历数据，保持一致的日程安排。",
    importExportTips: "导入导出提示",
    tip1: "导出的iCalendar (.ics) 文件可以直接导入到大多数日历应用中",
    tip2: "CSV格式适合与电子表格应用程序进行数据交换",
    tip3: "JSON格式包含最完整的事件数据，适合作为备份",
    tip4: "导入大量事件可能需要一些时间，请耐心等待",
    tip5: "定期导出您的日历数据作为备份是个好习惯",
    dateAndTime: "日期和时间",
    copy: "副本",
    eventDuplicated: "事件已复制",
    welcomeToOneCalendar: "欢迎使用One Calendar",
    powerfulCalendarApp: "这是一个功能强大的日历应用，不仅可以管理您的日程，还能提供时间分析、智能建议和心情追踪功能。",
    basicFeatures: "基础功能",
    timeAnalyticsFeatures: "时间分析",
    scheduleSuggestionsFeatures: "智能建议",
    importExportFeatures: "导入导出",
    createEventGuide: "创建事件",
    createEventDesc: '点击侧边栏顶部的"创建日程"按钮，或直接点击日历上的时间段来创建新事件。',
    switchViewGuide: "切换视图",
    switchViewDesc: "使用顶部导航栏的下拉菜单在日、周、月和分析视图之间切换。",
    manageCalendarCategoriesGuide: "管理日历分类",
    manageCalendarCategoriesDesc: '在侧边栏的"我的日历"部分，您可以添加、编辑和删除不同的日历分类。',
    setReminderGuide: "设置提醒",
    setReminderDesc: "创建或编辑事件时，您可以设置提醒时间，系统会在事件开始前通知您。",
    howToAccessTimeAnalytics: "如何使用时间分析",
    timeAnalyticsDesc: '点击侧边栏的"分析与洞察"按钮，或在顶部导航栏的视图选择器中选择"分析"。',
    howToUseSmartSchedule: "如何使用智能日程建议",
    smartScheduleDesc: "在分析视图中，您可以找到智能日程建议功能。它会根据您的偏好和现有日程，推荐最佳的会议时间。",
    howToUseIX: "如何使用导入导出",
    IXDesc: "在分析视图中，您可以找到心情追踪功能。它允许您 daor",
    moodTrackerFeaturesList:
      "主要功能：记录每天的心情和备注，关联心情与日历事件，查看心情趋势图表，分析不同活动对心情的影响。",
    getStarted: "开始使用",
    nextStep: "下一步",
    previousStep: "上一步",
    startUsing: "开始使用",
    keyFeatures: "主要功能",
    timeDistributionFeature: "查看时间分布图表",
    productivityAnalysisFeature: "分析高效时段和日期",
    customCategoriesFeature: "创建自定义时间分类",
    timeUsageTrendsFeature: "查看时间使用趋势",
    preferenceSettingFeature: "设置工作日和时间偏好",
    meetingDurationFeature: "调整会议时长和缓冲时间",
    intelligentSuggestionsFeature: "获取智能排序的时间建议",
    quickEventCreationFeature: "从建议直接创建事件",
    dailyMoodRecordingFeature: "记录每日心情和备注",
    eventAssociationFeature: "关联心情与日历事件",
    moodTrendAnalysisFeature: "查看心情趋势图表",
    activityImpactFeature: "分析活动对心情的影响",
  },
}

// 检测系统语言
function detectSystemLanguage(): Language {
  if (typeof window === "undefined") {
    return "zh" // 默认为中文
  }

  // 获取浏览器语言
  const browserLang = navigator.language.toLowerCase()

  // 如果浏览器语言以zh开头（如zh-CN, zh-TW等），返回中文
  if (browserLang.startsWith("zh")) {
    return "zh"
  }

  // 否则返回英文
  return "en"
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguageState] = useState<Language>("zh") // 默认为中文

  useEffect(() => {
    // 首先检查localStorage中是否有存储的语言偏好
    const storedLanguage = localStorage.getItem("preferred-language")

    if (storedLanguage === "en" || storedLanguage === "zh") {
      // 如果有存储的语言偏好，使用它
      setLanguageState(storedLanguage)
    } else {
      // 如果没有存储的语言偏好，检测系统语言
      const systemLanguage = detectSystemLanguage()
      setLanguageState(systemLanguage)
      // 将检测到的系统语言保存到localStorage
      localStorage.setItem("preferred-language", systemLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("preferred-language", lang)
  }

  return [language, setLanguage]
}

