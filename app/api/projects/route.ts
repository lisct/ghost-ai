import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: { name?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const rawName = typeof body?.name === "string" ? body.name : "";
  const name = rawName.trim() || "Untitled Project";

  const project = await db.project.create({
    data: { ownerId: userId, name },
  });

  return Response.json(project, { status: 201 });
}
