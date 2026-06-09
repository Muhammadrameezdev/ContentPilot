import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Queue resumed", paused: false });
  } catch (error) {
    console.error("Queue resume error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
