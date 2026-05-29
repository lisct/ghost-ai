"use client"

import { useState } from "react"
import type { Project } from "@/lib/mock-projects"

type DialogType = "none" | "create" | "rename" | "delete"

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<DialogType>("none")
  const [formName, setFormName] = useState("")
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function openCreateDialog() {
    setFormName("")
    setTargetProject(null)
    setDialog("create")
  }

  function openRenameDialog(project: Project) {
    setFormName(project.name)
    setTargetProject(project)
    setDialog("rename")
  }

  function openDeleteDialog(project: Project) {
    setTargetProject(project)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog("none")
    setFormName("")
    setTargetProject(null)
    setIsLoading(false)
  }

  return {
    dialog,
    formName,
    setFormName,
    targetProject,
    isLoading,
    setIsLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
  }
}
