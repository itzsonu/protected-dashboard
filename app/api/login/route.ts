import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (
      username !== process.env.DEMO_USERNAME ||
      password !== process.env.DEMO_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createSession(username, username === "admin" ? "admin" : "student");

    return NextResponse.json({
      message: "Login successful",
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
