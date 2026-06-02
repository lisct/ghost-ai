"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectDialogsContext } from "./project-dialogs-context";
import { CreateProjectDialog } from "./dialogs/create-project-dialog";
import { RenameProjectDialog } from "./dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectListItem } from "@/lib/projects";

interface EditorShellProps {
  children: React.ReactNode;
  myProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
}

export function EditorShell({ children, myProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    dialog,
    formName,
    setFormName,
    roomIdPreview,
    targetProject,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions();

  return (
    <ProjectDialogsContext.Provider
      value={{ openCreateDialog, openRenameDialog, openDeleteDialog }}
    >
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={openCreateDialog}
        onRenameProject={openRenameDialog}
        onDeleteProject={openDeleteDialog}
        myProjects={myProjects}
        sharedProjects={sharedProjects}
      />
      <main className="mt-12 h-[calc(100vh-3rem)]">{children}</main>

      <CreateProjectDialog
        open={dialog === "create"}
        onClose={closeDialog}
        onSubmit={handleCreate}
        formName={formName}
        setFormName={setFormName}
        roomIdPreview={roomIdPreview}
        isLoading={isLoading}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        onClose={closeDialog}
        onSubmit={handleRename}
        project={targetProject}
        formName={formName}
        setFormName={setFormName}
        isLoading={isLoading}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        onClose={closeDialog}
        onSubmit={handleDelete}
        project={targetProject}
        isLoading={isLoading}
      />
    </ProjectDialogsContext.Provider>
  );
}
