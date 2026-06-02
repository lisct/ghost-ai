"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectListItem } from "@/lib/projects";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProject: () => void;
  onRenameProject: (project: ProjectListItem) => void;
  onDeleteProject: (project: ProjectListItem) => void;
  myProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  onRenameProject,
  onDeleteProject,
  myProjects,
  sharedProjects,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed top-12 left-0 right-0 bottom-0 z-[29] bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed left-0 top-12 z-30 flex h-[calc(100vh-3rem)] w-72 flex-col border-r border-surface-border bg-surface transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <span className="text-sm font-medium text-copy-primary">
            Projects
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-3 py-3">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>
            <TabsContent value="my-projects" className="mt-2 flex-1">
              {myProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-copy-muted">No projects yet.</p>
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {myProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>
            <TabsContent value="shared" className="mt-2 flex-1">
              {sharedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-copy-muted">No shared projects.</p>
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-surface-border p-3">
          <Button className="w-full gap-2" onClick={onNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}

interface ProjectItemProps {
  project: ProjectListItem;
  onRename: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  return (
    <li className="group flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 hover:bg-elevated">
      <span className="truncate text-sm text-copy-secondary">
        {project.name}
      </span>
      {project.isOwned && (
        <div className="ml-2 flex shrink-0 gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              onRename(project);
            }}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </li>
  );
}
