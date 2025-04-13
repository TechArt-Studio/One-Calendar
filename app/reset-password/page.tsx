import { Calendar } from "lucide-react"

import { ResetPasswordForm } from "@/components/ResetForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-500 opacity-20 blur-[80px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-25 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[250px] w-[250px] rounded-full bg-indigo-500 opacity-20 blur-[90px]" />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
            <Calendar className="size-4" color="#0066ff" />
          One Calendar
        </a>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
