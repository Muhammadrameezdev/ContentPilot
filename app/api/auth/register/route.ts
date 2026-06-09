import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = schema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Create default workspace for the user
    await prisma.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        slug: email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-"),
        plan: "STARTER",
        members: {
          create: { userId: user.id, role: "OWNER" },
        },
      },
    });

    // Stub: Send verification email
    // REQUIRES: RESEND_API_KEY env var
    console.log(`Stub: Sending verification email to ${email}`);

    return NextResponse.json(
      { data: { message: "Check your email" } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
