import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import {
  getUsers,
  logRoleChange,
  saveUsers,
  type UserRole,
} from "@/lib/user-store";

const allowedRoles: UserRole[] = ["admin", "student"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUserRole(value: unknown): value is UserRole {
  return allowedRoles.some((role) => role === value);
}

export async function POST(request: NextRequest) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { userId, newRole, confirmChange } = body;
  const parsedUserId =
    typeof userId === "number"
      ? userId
      : typeof userId === "string" && userId.trim() !== ""
        ? Number(userId)
        : NaN;

  if (confirmChange !== true) {
    return NextResponse.json(
      { error: "Explicit confirmation is required" },
      { status: 400 }
    );
  }

  if (!isUserRole(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (!Number.isSafeInteger(parsedUserId) || parsedUserId < 1) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const users = await getUsers();
    const targetUser = users.find((user) => user.id === parsedUserId);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const oldRole = targetUser.role;
    targetUser.role = newRole;

    await saveUsers(users);
    await logRoleChange(
      session.userId,
      targetUser.username,
      oldRole,
      targetUser.role
    );

    return NextResponse.json({
      message: "Role changed successfully",
      user: targetUser,
    });
  } catch (error) {
    console.error("Failed to change user role:", error);
    return NextResponse.json(
      { error: "Failed to change user role" },
      { status: 500 }
    );
  }
}
