import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"
import { db } from "@/lib/prisma"
import { getCurrentIdentity } from "@/lib/project-access"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators">
) {
  const identity = await getCurrentIdentity()
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })

  const isOwner = project.ownerId === identity.userId
  if (!isOwner) {
    const membership = await db.projectCollaborator.findFirst({
      where: { projectId, email: identity.email },
      select: { id: true },
    })
    if (!membership) return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const rows = await db.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true },
  })

  // Enrich with Clerk display names and avatars
  let enriched: { id: string; email: string; displayName: string; imageUrl: string | null }[] = rows.map(
    (r) => ({ ...r, displayName: r.email, imageUrl: null })
  )

  if (rows.length > 0) {
    try {
      const clerk = await clerkClient()
      const { data: users } = await clerk.users.getUserList({
        emailAddress: rows.map((r) => r.email),
        limit: 100,
      })
      const userMap = new Map<string, { displayName: string; imageUrl: string }>()
      for (const u of users) {
        const name = [u.firstName, u.lastName].filter(Boolean).join(" ")
        for (const ea of u.emailAddresses) {
          userMap.set(ea.emailAddress.toLowerCase(), {
            displayName: name || ea.emailAddress,
            imageUrl: u.imageUrl,
          })
        }
      }
      enriched = rows.map((r) => {
        const clerk = userMap.get(r.email.toLowerCase())
        return {
          id: r.id,
          email: r.email,
          displayName: clerk?.displayName ?? r.email,
          imageUrl: clerk?.imageUrl ?? null,
        }
      })
    } catch {
      // Clerk enrichment failed — fall back to email-only display
    }
  }

  return Response.json({ collaborators: enriched, isOwner })
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators">
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  let body: { email?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const raw = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!raw || !EMAIL_RE.test(raw))
    return Response.json({ error: "A valid email is required" }, { status: 400 })

  try {
    const collaborator = await db.projectCollaborator.create({
      data: { projectId, email: raw },
    })
    return Response.json(collaborator, { status: 201 })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002")
      return Response.json({ error: "This person is already a collaborator" }, { status: 409 })
    throw e
  }
}
