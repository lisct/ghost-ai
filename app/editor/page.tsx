import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { EditorShell } from "@/components/editor/editor-shell"
import { EditorHome } from "@/components/editor/editor-home"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

export default async function EditorPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ""

  const [myProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(userId),
    getSharedProjects(email),
  ])

  return (
    <EditorShell myProjects={myProjects} sharedProjects={sharedProjects}>
      <EditorHome />
    </EditorShell>
  )
}
