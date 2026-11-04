
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type UserRole = "admin" | "student";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing");
  }

  return new TextEncoder().encode(secret);
}

// Create signed session with username and role
export async function createSession(
  userId: string,
  role: UserRole
) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getSecretKey());

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
}

// Verify session and role
export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (
      typeof payload.userId !== "string" ||
      (payload.role !== "admin" && payload.role !== "student")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}