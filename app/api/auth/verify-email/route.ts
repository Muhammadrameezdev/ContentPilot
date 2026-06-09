import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token, expires: { gt: new Date() } },
    });

    if (!verificationToken) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      }),
    ]);

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST() {
  // Resend verification email
  try {
    return NextResponse.json({ message: "Verification email sent" });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
