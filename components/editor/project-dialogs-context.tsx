"use client"

import { createContext, useContext } from "react"
import type { Project } from "@/lib/mock-projects"

interface ProjectDialogsContextValue {
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
}

export const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(null)

export function useProjectDialogsContext() {
  const ctx = useContext(ProjectDialogsContext)
  if (!ctx) throw new Error("useProjectDialogsContext must be used within ProjectDialogsContext.Provider")
  return ctx
}
