import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Authenticate administrator
    if (
      username === "admin" &&
      password === "Admin@12345"
    ) {
      await createSession("admin", "admin");

      return NextResponse.json({
        message: "Admin login successful",
        role: "admin",
      });
    }

    // Authenticate student
    if (
      username === "student" &&
      password === "Student@12345"
    ) {
      await createSession("student", "student");

      return NextResponse.json({
        message: "Student login successful",
        role: "student",
      });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}