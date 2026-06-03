"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isAiSidebarOpen: boolean
  onToggleAiSidebar: () => void
  onOpenShare: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onOpenShare,
}: WorkspaceNavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-surface-border bg-surface">
      <div className="flex h-full flex-1 items-center px-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex h-full flex-1 items-center justify-center">
        <span className="max-w-xs truncate text-sm font-medium text-copy-primary">
          {projectName}
        </span>
      </div>

      <div className="flex h-full flex-1 items-center justify-end gap-1 px-3">
        <Button variant="ghost" size="sm" className="gap-1.5 text-copy-secondary" onClick={onOpenShare}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAiSidebar}
          aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          className={isAiSidebarOpen ? "text-brand" : "text-copy-secondary"}
        >
          <Sparkles className="h-5 w-5" />
        </Button>
        <UserButton />
      </div>
    </nav>
  )
}
