"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectDialogsContext } from "./project-dialogs-context";
import { CreateProjectDialog } from "./dialogs/create-project-dialog";
import { RenameProjectDialog } from "./dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
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
  } = useProjectDialogs();

  async function handleCreate() {
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));
      closeDialog();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRename() {
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));
      closeDialog();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));
      closeDialog();
    } finally {
      setIsLoading(false);
    }
  }

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
      />
      <main className="mt-12 h-[calc(100vh-3rem)]">{children}</main>

      <CreateProjectDialog
        open={dialog === "create"}
        onClose={closeDialog}
        onSubmit={handleCreate}
        formName={formName}
        setFormName={setFormName}
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
