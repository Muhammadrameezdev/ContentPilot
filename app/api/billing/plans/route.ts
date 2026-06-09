import { NextResponse } from "next/server";
import { PLANS } from "@/lib/stripe";

export async function GET() {
  return NextResponse.json(PLANS);
}
