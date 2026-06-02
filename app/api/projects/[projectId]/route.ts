import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/projects/[projectId]">
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params
  const body = await request.json().catch(() => ({}))
  const name: string = body?.name?.trim() || "Untitled Project"

  const { count } = await db.project.updateMany({
    where: { id: projectId, ownerId: userId },
    data: { name },
  })

  if (count === 0) {
    const exists = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })
    if (!exists) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await db.project.findUnique({ where: { id: projectId } })
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json(updated)
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/projects/[projectId]">
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params

  const { count } = await db.project.deleteMany({
    where: { id: projectId, ownerId: userId },
  })

  if (count === 0) {
    const exists = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })
    if (!exists) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  return new Response(null, { status: 204 })
}
