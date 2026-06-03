import { redirect } from "next/navigation"
import { getCurrentIdentity, getProjectWithAccess } from "@/lib/project-access"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()
  if (!identity) redirect("/sign-in")

  const { userId, email } = identity

  const [project, myProjects, sharedProjects] = await Promise.all([
    getProjectWithAccess(roomId, userId, email),
    getOwnedProjects(userId),
    getSharedProjects(email),
  ])

  if (!project) return <AccessDenied />

  return (
    <WorkspaceShell
      project={project}
      myProjects={myProjects}
      sharedProjects={sharedProjects}
      isOwner={project.isOwner}
    />
  )
}
