import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <p>User ID: {session.userId}</p>
      <p>Role: {session.role}</p>
    </main>
  );
}
