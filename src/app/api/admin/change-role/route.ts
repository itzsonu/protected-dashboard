import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import {
  getUsers,
  saveUsers,
  logRoleChange,
  UserRole,
} from "@/lib/user-store";

export async function POST(request: NextRequest) {
  try {
    // Verify logged-in user
    const session = await verifySession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can change roles
    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { userId, newRole, confirmChange } =
      await request.json();

    // Validate confirmation
    if (confirmChange !== true) {
      return NextResponse.json(
        { error: "Explicit confirmation is required" },
        { status: 400 }
      );
    }

    // Validate allowed roles
    const allowedRoles: UserRole[] = ["admin", "student"];

    if (!allowedRoles.includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Find target user
    const users = await getUsers();

    const targetUser = users.find(
      (user) => user.id === Number(userId)
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const oldRole = targetUser.role;

    // Update role
    targetUser.role = newRole;

    await saveUsers(users);

    // Record the change
    await logRoleChange(
      session.userId,
      targetUser.username,
      oldRole,
      newRole
    );

    return NextResponse.json({
      message: "Role changed successfully",
      user: targetUser,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}