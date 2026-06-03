# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 09: Share Dialog — Complete

## Current Goal

- None. Share dialog with invite, remove, and Clerk enrichment implemented.

## Completed

- `01-design-system`: shadcn/ui initialized (Nova preset, Radix), all required UI primitives installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, `lib/utils.ts` created with `cn()` helper, `globals.css` updated with full Ghost AI dark theme tokens and shadcn semantic token overrides.
- `02-editor`: `EditorNavbar` and `ProjectSidebar` shell components created. Navbar is fixed-height with sidebar toggle (`PanelLeftOpen`/`PanelLeftClose`). Sidebar floats as an overlay (translate-x transition, does not push content), includes Projects header with close button, shadcn Tabs (My Projects / Shared) with empty placeholder states, and a full-width New Project button. Dialog pattern is ready via the existing shadcn `Dialog` component in `components/ui/dialog.tsx`.
- `03-auth`: `@clerk/ui` installed. `proxy.ts` at project root wraps `clerkMiddleware` — all routes protected by default, `/sign-in` and `/sign-up` are public. `ClerkProvider` wraps root layout with Clerk `dark` base theme and CSS variable overrides (no hardcoded colors). Sign-in page (`/sign-in`) and sign-up page (`/sign-up`) use a two-panel layout: left panel (lg+) shows logo, tagline, and feature list; right panel shows the Clerk form; small screens show form only. `/` redirects authenticated users to `/editor` and unauthenticated users to `/sign-in`. `UserButton` added to the editor navbar right section.
- `04-project-dialog`: Editor home screen with heading/description/New Project button. Create, Rename, and Delete project dialogs. Sidebar project item actions (rename, delete) with owned-only gating. Mobile backdrop scrim. `useProjectDialogs` hook + `ProjectDialogsContext`. Mock data only — no API calls.
- `05-prisma`: `prisma/models/project.prisma` with `Project` and `ProjectCollaborator` models, enum `ProjectStatus` (DRAFT/ARCHIVED), cascade delete, correct indexes and unique constraints. `lib/prisma.ts` exports `db` as a cached singleton — branches on `DATABASE_URL`: `prisma+postgres://` uses `PrismaPg` adapter + Accelerate extension, otherwise uses `PrismaPg` directly. Migration `20260529191638_init` applied to Prisma Postgres. Generated client at `app/generated/prisma/`. `@prisma/extension-accelerate` installed.
- `06-project-apis`: REST endpoints at `app/api/projects/route.ts` (GET list, POST create) and `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE). Clerk `auth()` guards all routes (401 for unauthenticated). Owner-only enforcement on PATCH and DELETE (403 for non-owner). Missing name defaults to "Untitled Project". Backend only — UI not wired.
- `07-wire-editor-home`: `lib/projects.ts` exports `ProjectListItem`, `getOwnedProjects`, `getSharedProjects`. `app/editor/page.tsx` is a server component that fetches both lists and passes them to `EditorShell`. `hooks/use-project-actions.ts` manages dialog state, generates room ID preview (slug + short suffix), and calls the project API (create → navigate to `/editor/{id}`, rename → refresh, delete → redirect or refresh). `EditorShell`, `ProjectSidebar`, all three dialogs, and `ProjectDialogsContext` updated to use `ProjectListItem` from `lib/projects`; mock data removed.
- `08-editor-workspace-shell`: `lib/project-access.ts` exports `getCurrentIdentity` (userId + normalized email via Clerk) and `getProjectWithAccess` (owner or collaborator check, returns `isOwner`). `app/editor/[roomId]/page.tsx` is a server component — redirects unauthenticated users, shows `AccessDenied` for missing/unauthorized projects, otherwise renders `WorkspaceShell`. `components/editor/access-denied.tsx` — centered lock icon, message, link back to `/editor`. `components/editor/workspace-navbar.tsx` — project name center, Share + AI sidebar toggle + UserButton right. `components/editor/workspace-shell.tsx` — full-viewport layout: left `ProjectSidebar` with `activeProjectId`, canvas placeholder, right AI sidebar placeholder (slide-over). `ProjectSidebar` updated with optional `activeProjectId` prop that highlights the active item.
- `09-share-dialog`: `GET /api/projects/[projectId]/collaborators` lists collaborators enriched with Clerk display name + avatar (falls back to email if no Clerk user found); returns `isOwner`. `POST` invites a new collaborator (owner only, email validated, 409 on duplicate). `DELETE /api/projects/[projectId]/collaborators/[collaboratorId]` removes a collaborator (owner only). `components/editor/share-dialog.tsx` — owners see invite input + remove buttons + copy-link; collaborators see read-only list + copy-link. Clerk avatars served via `img.clerk.com` (added to `next.config.ts` `remotePatterns`). `WorkspaceNavbar` Share button wired; `WorkspaceShell` renders `ShareDialog` with `isOwner` from the server.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui uses Nova preset (Radix base, Lucide icons, Geist fonts). All shadcn tokens in `:root` are overridden directly with Ghost AI dark hex values — no `.dark` class toggle needed (dark-only app).
- Editor sidebar is a fixed overlay (`position: fixed`, translate-x transition) that does not push canvas content. State (`isOpen`) is managed by the parent editor page and passed as props to both `EditorNavbar` and `ProjectSidebar`.

## Session Notes

- `components/ui/*` files are generated by shadcn CLI — do not modify directly.
- All Ghost AI custom color tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) are defined in `:root` in `globals.css` and mapped to Tailwind utilities via `@theme inline` (e.g. `bg-base`, `text-copy-primary`, `text-brand`).
- `components/editor/*` are hand-authored editor shell components — safe to modify.
