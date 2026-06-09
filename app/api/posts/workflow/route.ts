import { serve } from "@upstash/workflow/nextjs";
import { prisma } from "@/lib/db";
import { FacebookClient } from "@/lib/facebook";

// Serverless publishing engine. Replaces the legacy in-memory Bull queue and
// local cron polling — Upstash Workflow durably waits until the scheduled time
// and survives function cold starts, which local timers cannot on Vercel.
interface WorkflowPayload {
  scheduledPostId: string;
}

export const { POST } = serve<WorkflowPayload>(async (context) => {
  const { scheduledPostId } = context.requestPayload;

  const post = await context.run("load-post", async () => {
    return prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
      include: { content: true, page: true },
    });
  });

  if (!post || post.status === "PUBLISHED" || post.status === "CANCELLED") {
    return;
  }

  // Durable delay until the post is due (no local setTimeout / interval).
  await context.sleepUntil("wait-for-schedule", new Date(post.scheduledAt));

  await context.run("mark-publishing", async () => {
    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: { status: "PUBLISHING" },
    });
  });

  await context.run("publish-to-facebook", async () => {
    try {
      const client = new FacebookClient(post.page.accessToken);
      let facebookPostId: string;

      if (post.content.type === "IMAGE" && post.content.mediaUrl) {
        facebookPostId = (
          await client.publishPhoto(
            post.page.facebookPageId,
            post.content.mediaUrl,
            post.content.text
          )
        ).id;
      } else if (post.content.type === "VIDEO" && post.content.mediaUrl) {
        facebookPostId = (
          await client.publishVideo(
            post.page.facebookPageId,
            post.content.mediaUrl,
            post.content.text
          )
        ).id;
      } else {
        facebookPostId = (
          await client.publishPost(
            post.page.facebookPageId,
            post.content.text,
            post.content.linkUrl ? { link: post.content.linkUrl } : undefined
          )
        ).id;
      }

      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          facebookPostId,
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
        where: { id: scheduledPostId },
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
  });
});
