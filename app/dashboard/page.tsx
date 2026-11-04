import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";

export const instant = false;

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl rounded-xl bg-white p-10 shadow">
        <h1 className="mb-4 text-3xl font-bold text-green-700">
          Protected Dashboard
        </h1>

        <p className="mb-6 text-gray-700">
          Welcome! You have successfully logged in.
        </p>

        <div className="rounded-lg bg-green-50 p-5">
          <p className="font-semibold text-green-800">
            Authentication Successful
          </p>

          <p className="mt-2 text-gray-700">User ID: {session.userId}</p>

          <p className="mt-2 text-gray-700">Role: {session.role}</p>

          <p className="mt-2 text-gray-700">
            Your dashboard is protected by server-side session validation.
          </p>
        </div>
      </div>
    </main>
  );
}
