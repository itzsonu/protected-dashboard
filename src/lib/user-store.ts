import fs from "fs/promises";
import path from "path";

// Define allowed user roles
export type UserRole = "admin" | "student";

// Define user structure
export interface User {
  id: number;
  username: string;
  role: UserRole;
}

const dataDirectory = path.join(process.cwd(), "data");
const usersFile = path.join(dataDirectory, "users.json");
const auditFile = path.join(dataDirectory, "role-audit.log");

// Read users from JSON file
export async function getUsers(): Promise<User[]> {
  const data = await fs.readFile(usersFile, "utf-8");
  return JSON.parse(data);
}

// Save updated users
export async function saveUsers(users: User[]) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

// Record successful role changes
export async function logRoleChange(
  admin: string,
  target: string,
  oldRole: string,
  newRole: string
) {
  const log = {
    admin,
    target,
    oldRole,
    newRole,
    timestamp: new Date().toISOString(),
  };

  await fs.appendFile(auditFile, JSON.stringify(log) + "\n");
}