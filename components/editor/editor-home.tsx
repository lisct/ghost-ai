"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"

export function EditorHome() {
  const { openCreateDialog } = useProjectDialogsContext()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl font-semibold text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="text-sm text-copy-muted">
        Start a new architecture workspace, or choose a project from the sidebar.
      </p>
      <Button className="mt-2 gap-2" onClick={openCreateDialog}>
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  )
}
