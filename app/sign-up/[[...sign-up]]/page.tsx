import { SignUp } from "@clerk/nextjs"
import { AuthPanel } from "@/components/auth/auth-panel"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-base">
      <AuthPanel />
      <div className="flex flex-1 items-center justify-center p-6 bg-base">
        <SignUp />
      </div>
    </div>
  )
}
