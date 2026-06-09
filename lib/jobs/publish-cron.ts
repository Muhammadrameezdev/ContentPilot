import { prisma } from "@/lib/db";
import { FacebookClient } from "@/lib/facebook";

export async function publishQueuedPosts() {
  const now = new Date();

  const posts = await prisma.scheduledPost.findMany({
    where: {
      status: "QUEUED",
      scheduledAt: { lte: now },
    },
    include: {
      content: true,
      page: true,
    },
    take: 10,
  });

  for (const post of posts) {
    try {
      await prisma.scheduledPost.update({
        where: { id: post.id },
        data: { status: "PUBLISHING" },
      });

      const client = new FacebookClient(post.page.accessToken);
      let fbPostId: string;

      if (post.content.type === "IMAGE" && post.content.mediaUrl) {
        const result = await client.publishPhoto(
          post.page.facebookPageId,
          post.content.mediaUrl,
          post.content.text
        );
        fbPostId = result.id;
      } else {
        const result = await client.publishPost(
          post.page.facebookPageId,
          post.content.text
        );
        fbPostId = result.id;
      }

      await prisma.scheduledPost.update({
        where: { id: post.id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          facebookPostId: fbPostId,
        },
      });

      await prisma.notification.create({
        data: {
          userId: post.scheduledBy,
          type: "POST_PUBLISHED",
          title: "Post Published",
          message: `Your post was published to ${post.page.name}`,
        },
      });
    } catch (error) {
      const retryCount = post.retryCount + 1;
      await prisma.scheduledPost.update({
        where: { id: post.id },
        data: {
          status: retryCount >= 3 ? "FAILED" : "QUEUED",
          retryCount,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        },
      });

      if (retryCount >= 3) {
        await prisma.notification.create({
          data: {
            userId: post.scheduledBy,
            type: "POST_FAILED",
            title: "Post Failed",
            message: `Failed to publish to ${post.page.name} after 3 attempts`,
          },
        });
      }
    }
  }
}

export async function checkTokenExpiry() {
  const sevenDaysFromNow = new Date(Date.now() + 7 * 86400000);

  const expiringPages = await prisma.facebookPage.findMany({
    where: {
      tokenExpiresAt: { lte: sevenDaysFromNow },
    },
    include: { workspace: { include: { members: { where: { role: "OWNER" } } } } },
  });

  for (const page of expiringPages) {
    for (const member of page.workspace.members) {
      await prisma.notification.create({
        data: {
          userId: member.userId,
          type: "TOKEN_EXPIRING",
          title: "Token Expiring Soon",
          message: `The access token for ${page.name} expires soon. Please reconnect.`,
        },
      });
    }
  }
}

export async function retryFailedPosts() {
  const failedPosts = await prisma.scheduledPost.findMany({
    where: {
      status: "FAILED",
      retryCount: { lt: 3 },
    },
  });

  if (failedPosts.length > 0) {
    await prisma.scheduledPost.updateMany({
      where: { id: { in: failedPosts.map((p) => p.id) } },
      data: { status: "QUEUED" },
    });
  }
}
