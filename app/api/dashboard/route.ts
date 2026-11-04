import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function GET() {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.json(
    {
      message: "Dashboard data retrieved successfully",
      user: session.userId,
      data: {
        totalProjects: 5,
        completedProjects: 3,
        pendingProjects: 2,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
