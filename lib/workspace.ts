import { prisma } from "./db";

export async function getCurrentWorkspaceId(userId: string): Promise<string | null> {
  const member = await prisma.workspaceMember.findFirst({
    where: { userId },
    select: { workspaceId: true },
    orderBy: { joinedAt: "asc" }, // Get oldest/first workspace
  });
  return member?.workspaceId ?? null;
}
