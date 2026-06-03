"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Check, Copy, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Collaborator {
  id: string;
  email: string;
  displayName: string;
  imageUrl: string | null;
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({
  open,
  onClose,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const data = (await res.json()) as { collaborators: Collaborator[] };
        setCollaborators(data.collaborators ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      setEmail("");
      setInviteError(null);
      setRemoveError(null);
      fetchCollaborators();
    }
  }, [open, fetchCollaborators]);

  async function handleInvite() {
    const trimmed = email.trim();
    if (!trimmed) return;
    setIsInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setInviteError(body?.error ?? "Failed to invite collaborator");
        return;
      }
      setEmail("");
      await fetchCollaborators();
    } catch {
      setInviteError("Something went wrong. Please try again.");
    } finally {
      setIsInviting(false);
    }
  }

  async function handleRemove(collaboratorId: string) {
    setRemovingId(collaboratorId);
    setRemoveError(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setRemoveError(body?.error ?? "Failed to remove collaborator");
        return;
      }
      await fetchCollaborators();
    } catch {
      setRemoveError("Something went wrong. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleCopyLink() {
    const url = window.location.href;
    let copied = false;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch {
        // clipboard API rejected — fall through to execCommand
      }
    }
    if (!copied) {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      copied = document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (copied) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg text-white">
            Share Project
          </DialogTitle>
        </DialogHeader>

        {isOwner && (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2">
              <Input
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInviteError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleInvite();
                  }
                }}
                className="text-white"
              />
              <Button
                disabled={!email.trim() || isInviting}
                onClick={handleInvite}
                className="shrink-0"
              >
                {isInviting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Invite"
                )}
              </Button>
            </div>
            {inviteError && <p className="text-xs text-error">{inviteError}</p>}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-copy-muted">
            Collaborators
          </p>
          {removeError && <p className="text-xs text-error">{removeError}</p>}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-copy-muted" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="py-2 text-sm text-copy-muted">
              No collaborators yet.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {collaborators.map((c) => (
                <CollaboratorRow
                  key={c.id}
                  collaborator={c}
                  isOwner={isOwner}
                  isRemoving={removingId === c.id}
                  onRemove={() => handleRemove(c.id)}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleCopyLink}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <DialogClose render={<Button variant="outline" />}>Done</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CollaboratorRowProps {
  collaborator: Collaborator;
  isOwner: boolean;
  isRemoving: boolean;
  onRemove: () => void;
}

function CollaboratorRow({
  collaborator,
  isOwner,
  isRemoving,
  onRemove,
}: CollaboratorRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-1.5">
      <Avatar
        name={collaborator.displayName}
        imageUrl={collaborator.imageUrl}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm text-copy-primary">
          {collaborator.displayName}
        </span>
        {collaborator.displayName !== collaborator.email && (
          <span className="truncate text-xs text-copy-muted">
            {collaborator.email}
          </span>
        )}
      </div>
      {isOwner && (
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isRemoving}
          onClick={onRemove}
          aria-label={`Remove ${collaborator.displayName}`}
        >
          {isRemoving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </Button>
      )}
    </li>
  );
}

function Avatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded-full object-cover"
        unoptimized
      />
    );
  }

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-medium text-copy-secondary">
      {initials || "?"}
    </div>
  );
}
