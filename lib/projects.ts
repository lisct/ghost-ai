import { db } from "@/lib/prisma"

export interface ProjectListItem {
  id: string
  name: string
  isOwned: boolean
}

export async function getOwnedProjects(userId: string): Promise<ProjectListItem[]> {
  const rows = await db.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  })
  return rows.map((r) => ({ ...r, isOwned: true }))
}

export async function getSharedProjects(email: string): Promise<ProjectListItem[]> {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) return []
  const rows = await db.projectCollaborator.findMany({
    where: { email: normalizedEmail },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
  return rows.map((r) => ({ id: r.project.id, name: r.project.name, isOwned: false }))
}
