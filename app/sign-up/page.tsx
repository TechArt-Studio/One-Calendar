import { Calendar } from "lucide-react"

import { SignUpForm } from "@/components/SignUpForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center from-blue-500 via-indigo-500 to-purple-500 gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
            <Calendar className="size-4" color="#0066ff" />
          One Calendar
        </a>
        <SignUpForm />
    </div>
  )
}
