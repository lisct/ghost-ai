"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/mock-projects"

interface DeleteProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  project: Project | null
  isLoading: boolean
}

export function DeleteProjectDialog({
  open,
  onClose,
  onSubmit,
  project,
  isLoading,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg text-white">Delete Project</DialogTitle>
          <DialogDescription>
            {project ? (
              <>
                Are you sure you want to delete{" "}
                <span className="text-copy-secondary">{project.name}</span>?
                This action cannot be undone.
              </>
            ) : (
              "This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" disabled={isLoading} onClick={onSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Project"
            )}
          </Button>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
