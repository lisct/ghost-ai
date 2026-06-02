import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/projects/[projectId]">
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const name: string = body?.name?.trim() || "Untitled Project"

  const updated = await db.project.update({
    where: { id: projectId },
    data: { name },
  })

  return Response.json(updated)
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/projects/[projectId]">
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  await db.project.delete({ where: { id: projectId } })

  return new Response(null, { status: 204 })
}
