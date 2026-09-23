import { prisma } from "@/server/prisma";
import type { Role } from "@/server/adminAuth";

export interface AppUser {
  id: number;
  email: string;
  passwordHash: string;
  name: string | null;
  role: Role;
}

async function findByEmail(email: string): Promise<AppUser | null> {
  const row = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  return row ? { ...row, role: row.role as Role } : null;
}

async function create(data: {
  email: string;
  passwordHash: string;
  name?: string | null;
  role?: Role;
}): Promise<AppUser> {
  const row = await prisma.user.create({
    data: {
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name ?? null,
      role: data.role ?? "CUSTOMER",
    },
  });
  return { ...row, role: row.role as Role };
}

export const userService = { findByEmail, create };
