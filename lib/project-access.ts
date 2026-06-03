import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma"

export interface Identity {
  userId: string
  email: string
}

export async function getCurrentIdentity(): Promise<Identity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ""
  return { userId, email: email.trim().toLowerCase() }
}

export async function getProjectWithAccess(
  projectId: string,
  userId: string,
  email: string
): Promise<{ id: string; name: string; isOwner: boolean } | null> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })
  if (!project) return null
  if (project.ownerId === userId)
    return { id: project.id, name: project.name, isOwner: true }
  if (!email) return null
  const collaborator = await db.projectCollaborator.findFirst({
    where: { projectId, email },
    select: { id: true },
  })
  return collaborator ? { id: project.id, name: project.name, isOwner: false } : null
}
