"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { WorkspaceNavbar } from "./workspace-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogsContext } from "./project-dialogs-context"
import { CreateProjectDialog } from "./dialogs/create-project-dialog"
import { RenameProjectDialog } from "./dialogs/rename-project-dialog"
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog"
import { ShareDialog } from "./share-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectListItem } from "@/lib/projects"

interface WorkspaceShellProps {
  project: { id: string; name: string }
  myProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
  isOwner: boolean
}

export function WorkspaceShell({
  project,
  myProjects,
  sharedProjects,
  isOwner,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const {
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
  } = useProjectActions()

  return (
    <ProjectDialogsContext.Provider
      value={{ openCreateDialog, openRenameDialog, openDeleteDialog }}
    >
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={openCreateDialog}
        onRenameProject={openRenameDialog}
        onDeleteProject={openDeleteDialog}
        myProjects={myProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
      />

      <main className="mt-12 flex h-[calc(100vh-3rem)] items-center justify-center bg-base">
        <p className="text-sm text-copy-muted">Canvas coming soon</p>
      </main>

      <aside
        aria-hidden={!isAiSidebarOpen}
        inert={!isAiSidebarOpen}
        className={cn(
          "fixed right-0 top-12 z-30 flex h-[calc(100vh-3rem)] w-80 flex-col border-l border-surface-border bg-surface transition-transform duration-200 ease-in-out",
          isAiSidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none",
        )}
      >
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-copy-muted">AI Chat coming soon</p>
        </div>
      </aside>

      <ShareDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={project.id}
        isOwner={isOwner}
      />

      <CreateProjectDialog
        open={dialog === "create"}
        onClose={closeDialog}
        onSubmit={handleCreate}
        formName={formName}
        setFormName={setFormName}
        roomIdPreview={roomIdPreview}
        isLoading={isLoading}
        error={errorMessage}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        onClose={closeDialog}
        onSubmit={handleRename}
        project={targetProject}
        formName={formName}
        setFormName={setFormName}
        isLoading={isLoading}
        error={errorMessage}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        onClose={closeDialog}
        onSubmit={handleDelete}
        project={targetProject}
        isLoading={isLoading}
        error={errorMessage}
      />
    </ProjectDialogsContext.Provider>
  )
}
