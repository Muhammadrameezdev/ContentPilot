import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@contentpilot.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@contentpilot.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Create demo user
  const demoPassword = await hash("demo123456", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@contentpilot.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@contentpilot.com",
      password: demoPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      plan: "PRO",
      members: {
        create: [
          { userId: admin.id, role: "OWNER" },
          { userId: demoUser.id, role: "EDITOR" },
        ],
      },
    },
  });

  // Create Facebook Pages (mock)
  const pages = await Promise.all([
    prisma.facebookPage.create({
      data: {
        facebookPageId: "fb_page_1",
        name: "Tech Insights",
        accessToken: "mock_token_1",
        category: "Technology",
        followers: 18500,
        tokenExpiresAt: new Date(Date.now() + 60 * 86400000),
        workspaceId: workspace.id,
      },
    }),
    prisma.facebookPage.create({
      data: {
        facebookPageId: "fb_page_2",
        name: "Marketing Pro",
        accessToken: "mock_token_2",
        category: "Marketing",
        followers: 9200,
        tokenExpiresAt: new Date(Date.now() + 60 * 86400000),
        workspaceId: workspace.id,
      },
    }),
    prisma.facebookPage.create({
      data: {
        facebookPageId: "fb_page_3",
        name: "Brand Hub",
        accessToken: "mock_token_3",
        category: "Business",
        followers: 5400,
        tokenExpiresAt: new Date(Date.now() - 86400000), // expired
        workspaceId: workspace.id,
      },
    }),
  ]);

  // Create content items
  const contentItems = [
    { text: "5 AI tools every marketer needs in 2024", type: "TEXT" as const, status: "DRAFT" as const, tags: ["ai", "marketing"] },
    { text: "New product launch announcement! Check out our latest features", type: "IMAGE" as const, status: "TEMPLATE" as const, tags: ["product", "launch"] },
    { text: "Behind the scenes of our latest campaign shoot", type: "VIDEO" as const, status: "DRAFT" as const, tags: ["bts", "campaign"] },
    { text: "Monday motivation: The secret to consistency is starting before you're ready", type: "TEXT" as const, status: "DRAFT" as const, tags: ["motivation"] },
    { text: "Read our latest blog post on content strategy for Facebook in 2024", type: "LINK" as const, status: "DRAFT" as const, tags: ["blog", "strategy"] },
  ];

  const contents = await Promise.all(
    contentItems.map((item) =>
      prisma.content.create({
        data: {
          ...item,
          workspaceId: workspace.id,
          authorId: demoUser.id,
        },
      })
    )
  );

  // Create scheduled posts
  const scheduledPosts = [
    { contentId: contents[0].id, pageId: pages[0].id, status: "QUEUED" as const, scheduledAt: new Date(Date.now() + 3600000) },
    { contentId: contents[1].id, pageId: pages[1].id, status: "QUEUED" as const, scheduledAt: new Date(Date.now() + 7200000) },
    { contentId: contents[2].id, pageId: pages[0].id, status: "PUBLISHED" as const, scheduledAt: new Date(Date.now() - 86400000) },
    { contentId: contents[3].id, pageId: pages[2].id, status: "FAILED" as const, scheduledAt: new Date(Date.now() - 3600000) },
  ];

  for (const post of scheduledPosts) {
    await prisma.scheduledPost.create({
      data: {
        ...post,
        scheduledBy: demoUser.id,
        publishedAt: post.status === "PUBLISHED" ? new Date(Date.now() - 86400000) : null,
      },
    });
  }

  // Create analytics data (last 30 days)
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    for (const page of pages) {
      await prisma.pageAnalytics.create({
        data: {
          pageId: page.id,
          date,
          reach: Math.floor(Math.random() * 5000) + 1000,
          impressions: Math.floor(Math.random() * 8000) + 2000,
          likes: Math.floor(Math.random() * 300) + 50,
          comments: Math.floor(Math.random() * 80) + 10,
          shares: Math.floor(Math.random() * 50) + 5,
          clicks: Math.floor(Math.random() * 200) + 30,
        },
      });
    }
  }

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: demoUser.id, type: "POST_PUBLISHED", title: "Post Published", message: "Your post was published to Tech Insights" },
      { userId: demoUser.id, type: "POST_FAILED", title: "Post Failed", message: "Failed to publish to Brand Hub - token expired" },
      { userId: demoUser.id, type: "TOKEN_EXPIRING", title: "Token Expiring", message: "Brand Hub token expires in 5 days" },
      { userId: demoUser.id, type: "WEEKLY_REPORT", title: "Weekly Report", message: "Your weekly performance report is ready" },
    ],
  });

  console.log("✅ Seed completed!");
  console.log("📧 Admin: admin@contentpilot.com / admin123456");
  console.log("📧 Demo: demo@contentpilot.com / demo123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
