"use client"

import { createContext, useContext } from "react"
import type { ProjectListItem } from "@/lib/projects"

interface ProjectDialogsContextValue {
  openCreateDialog: () => void
  openRenameDialog: (project: ProjectListItem) => void
  openDeleteDialog: (project: ProjectListItem) => void
}

export const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(null)

export function useProjectDialogsContext() {
  const ctx = useContext(ProjectDialogsContext)
  if (!ctx) throw new Error("useProjectDialogsContext must be used within ProjectDialogsContext.Provider")
  return ctx
}
