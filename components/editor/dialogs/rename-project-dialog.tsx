"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectListItem } from "@/lib/projects";

interface RenameProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  project: ProjectListItem | null;
  formName: string;
  setFormName: (name: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function RenameProjectDialog({
  open,
  onClose,
  onSubmit,
  project,
  formName,
  setFormName,
  isLoading,
  error,
}: RenameProjectDialogProps) {
  function handleSubmit() {
    if (isLoading) return;
    if (formName.trim()) onSubmit();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg text-white">
            Rename Project
          </DialogTitle>
          {project && (
            <DialogDescription>
              Renaming{" "}
              <span className="text-copy-secondary">{project.name}</span>
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex flex-col gap-2 py-1">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            autoFocus
            className="text-white"
          />
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            disabled={!formName.trim() || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
