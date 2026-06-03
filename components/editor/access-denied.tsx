import Link from "next/link"
import { Lock } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-base">
      <Lock className="h-8 w-8 text-copy-muted" />
      <h1 className="text-lg font-semibold text-copy-primary">
        Access Denied
      </h1>
      <p className="text-sm text-copy-muted">
        This project doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
        Back to Projects
      </Link>
    </div>
  )
}
