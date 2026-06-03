import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma"

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators/[collaboratorId]">
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId, collaboratorId } = await ctx.params

  const project = await db.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  })
  if (!project) {
    const exists = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })
    if (!exists) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { count } = await db.projectCollaborator.deleteMany({
    where: { id: collaboratorId, projectId },
  })
  if (count === 0) return Response.json({ error: "Not found" }, { status: 404 })

  return new Response(null, { status: 204 })
}
