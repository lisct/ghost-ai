"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { ProjectListItem } from "@/lib/projects"

type DialogType = "none" | "create" | "rename" | "delete"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function shortSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json()
    return body?.error ?? `Request failed (${res.status})`
  } catch {
    return `Request failed (${res.status})`
  }
}

export function useProjectActions() {
  const router = useRouter()
  const params = useParams()
  const [dialog, setDialog] = useState<DialogType>("none")
  const [formName, setFormName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [targetProject, setTargetProject] = useState<ProjectListItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const roomIdPreview = formName.trim() ? `${toSlug(formName)}-${suffix}` : ""

  function openCreateDialog() {
    setFormName("")
    setSuffix(shortSuffix())
    setTargetProject(null)
    setErrorMessage(null)
    setDialog("create")
  }

  function openRenameDialog(project: ProjectListItem) {
    setFormName(project.name)
    setTargetProject(project)
    setErrorMessage(null)
    setDialog("rename")
  }

  function openDeleteDialog(project: ProjectListItem) {
    setTargetProject(project)
    setErrorMessage(null)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog("none")
    setFormName("")
    setTargetProject(null)
    setIsLoading(false)
    setErrorMessage(null)
  }

  async function handleCreate() {
    const name = formName.trim() || "Untitled Project"
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        setErrorMessage(await extractErrorMessage(res))
        setIsLoading(false)
        return
      }
      const project = (await res.json()) as { id: string }
      closeDialog()
      router.push(`/editor/${project.id}`)
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  async function handleRename() {
    if (!targetProject || !formName.trim()) return
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      })
      if (!res.ok) {
        setErrorMessage(await extractErrorMessage(res))
        setIsLoading(false)
        return
      }
      closeDialog()
      router.refresh()
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!targetProject) return
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        setErrorMessage(await extractErrorMessage(res))
        setIsLoading(false)
        return
      }
      const activeProjectId = params?.projectId as string | undefined
      closeDialog()
      if (activeProjectId === targetProject.id) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return {
    dialog,
    formName,
    setFormName,
    roomIdPreview,
    targetProject,
    isLoading,
    errorMessage,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
