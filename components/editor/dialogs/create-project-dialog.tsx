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

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formName: string;
  setFormName: (name: string) => void;
  roomIdPreview: string;
  isLoading: boolean;
}

export function CreateProjectDialog({
  open,
  onClose,
  onSubmit,
  formName,
  setFormName,
  roomIdPreview,
  isLoading,
}: CreateProjectDialogProps) {
  const canSubmit = Boolean(formName.trim()) && !isLoading;

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
            Create Project
          </DialogTitle>
          <DialogDescription>
            Name your new architecture workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-1">
          <Input
            placeholder="Project name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            autoFocus
            className="text-white"
          />
          <p className="h-4 text-xs text-copy-muted">
            {roomIdPreview && (
              <>
                Room ID:{" "}
                <span className="font-mono text-copy-secondary">{roomIdPreview}</span>
              </>
            )}
          </p>
        </div>
        <DialogFooter>
          <Button disabled={!canSubmit} onClick={onSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
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
